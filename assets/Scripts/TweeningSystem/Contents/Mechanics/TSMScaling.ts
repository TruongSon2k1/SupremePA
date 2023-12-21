import EXTScalingAction from "../../../Extender/EXTScalingAction";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass("TSMScaling")
export class TSMScaling extends TSAMechanic
{
    @property(
        {
            type: EXTScalingAction
        }
    )
    action: EXTScalingAction = new EXTScalingAction();

    _description_: string = "Apply a scaling action.";

    get duration(): number 
    {
        return this.action.duration;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        return this.action.generate(action);
    }
}
