import {EXTMovingAction} from "../../../Extender/EXTMovingAction";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass("TSMoving")
export class TSMoving extends TSAMechanic
{
    @property({ override: true, type: EXTMovingAction })
    optional: EXTMovingAction = new EXTMovingAction();

    _description_: string = "Apply a moving action.";

    get duration(): number 
    {
        return this.optional.duration;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        return this.optional.generate(action);
    }
}
