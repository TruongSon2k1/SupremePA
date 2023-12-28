import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass("TSMDelay")
export class TSMDelay extends TSAMechanic
{
    @property({min: 0})
    amount_of_time: number = 0;

    _description_: string = "Delay amount of time.";

    get duration(): number 
    {
        return this.amount_of_time;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        return action.delay(this.amount_of_time)
    }
}
