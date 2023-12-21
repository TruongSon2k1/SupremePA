import {NSCallerHelper} from "../../../NumericSignal/NSCallerHelper";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSACondition, _TSQCond_} from "../../Core/Condition/TSACondition";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQCond_.string)
@ccclass('TSCNumericCaller')
export class TSCNumericCaller extends TSACondition
{
    @property(
        {
            type: NSCallerHelper
        }
    )
    numeric: NSCallerHelper = new NSCallerHelper();

    @property(
        {

        }
    )
    recirculate: boolean = false;

    _description_: string = "Invoked after reaching the certain amount of the target caller number.";

    protected _reset(): void 
    {
        this.numeric.reset();
    }

    public ctor(): void 
    {
        this.numeric.init(this.call, this)
    }

    //protected init(): void {
    //    super.init();
    //    this.numeric.init(this.call, this)
    //}

    public update(dt: number): void 
    {
        if(this.numeric.is_ready) this.ready_up();
    }

    call(amount: number = 1)
    {
        this.numeric.call(amount);
    }
}
