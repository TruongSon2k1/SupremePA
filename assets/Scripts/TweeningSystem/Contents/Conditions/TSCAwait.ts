import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSACondition, _TSQCond_} from "../../Core/Condition/TSACondition";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQCond_.string)
@ccclass('TSCAwait')
export class TSCAwait extends TSACondition
{
    @property({ min: 0 })
    duration: number = 0

    _timer_: number = 0;

    _description_: string = "Invoke after a certain duration delay.";

    protected _reset(): void 
    {
        this._timer_ = 0;
    }

    public ctor(): void 
    {
        this._timer_ = 0;
    }

    public update(dt: number): void 
    {
        if(this.is_passed) return;

        if(this._timer_ >= this.duration)
        {
            this.ready_up();
            this._timer_ -= this.duration;
        }

        this._timer_ += dt;
    }
}
