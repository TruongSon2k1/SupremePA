import {IJSonData} from "../../../CC_pTS/Interface/IJSONData";
import {JSonObject} from "../../../CC_pTS/JSon/JSonObject";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSACondition, _TSQCond_} from "../../Core/Condition/TSACondition";

const {ccclass, property} = cc._decorator;


@ccclass('TSCAwaitHelper')
export class TSCAwaitHelper extends JSonObject
{
    @property({ min: 0 })
    private duration: number = 0

    private _timer_: number = 0;

    protected __to_json: () => string = () =>
    {
        return `
        {
            "duration": ${this.duration}
        }
        `
    };

    protected __init_from_json?: (data: IJSonData) => void = (data: IJSonData) =>
    {
        this.duration = data.data.duration;
    };

    public init()
    {
        this._timer_ = 0;
    }

    public reset()
    {
        this._timer_ -= 0;
    }

    public is_passed(reset: boolean = false): boolean
    {
        if (this._timer_ >= this.duration) {
            if (reset) this._timer_ -= this.duration;
            return true
        }
        return false
    }

    public timer(amount: number): void { this._timer_ += amount }
}

@fm_quick_reg_to(_TSQCond_.string)
@ccclass('TSCAwait')
export class TSCAwait extends TSACondition
{
    @property({ override: true, type: TSCAwaitHelper })
    optional: TSCAwaitHelper = new TSCAwaitHelper();

    _description_: string = "Invoke after a certain duration delay.";

    protected _reset(): void 
    {
        this.optional.reset();
    }

    public ctor(): void 
    {
        this.optional.init();
    }

    public update(dt: number): void 
    {
        if(this.is_passed) return;
        if(this.optional.is_passed(true)) 
        {
            this.ready_up()
        }
        this.optional.timer(dt);
    }


}
