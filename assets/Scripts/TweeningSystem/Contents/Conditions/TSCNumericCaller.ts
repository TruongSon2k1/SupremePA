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
            tooltip: `- Determine how the 'Numeric' should be reset.
                    \n- TRUE: The numeric will be set to the residual value after reaching to the target amount.
                    \n- FALE: The numeric will be set to 0`
        }
    )
    recirculate: boolean = false;

    _description_: string = "Invoked after reaching the certain amount of the target caller number.";

    protected _reset(): void 
    {
        if(this.recirculate) this.numeric.recirculate_reset()
        this.numeric.reset();
    }

    public ctor(): void 
    {
        this.numeric.init(this.call, this)
    }

    public update(): void 
    {
        if(this.numeric.is_ready) this.ready_up();
    }

    call(amount: number = 1)
    {
        this.numeric.call(amount);
    }

    public e_updater(): void 
    {
        this.numeric.e_updater();        
    }

    destroy()
    {
        this.numeric.destroy();
    }
}
