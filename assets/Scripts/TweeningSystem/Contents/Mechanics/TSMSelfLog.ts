import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass('TSMSelfLog')
export class TSMSelfLog extends TSAMechanic
{
    @property()
    custom_string: string = ""

    get duration(): number 
    {
        return 0;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        action.call(() => { console.log(this.custom_string, action.getTarget().getPosition()) });
        return action;
    }
    _description_: string = "Invoke a custom log message to the console.";
}
