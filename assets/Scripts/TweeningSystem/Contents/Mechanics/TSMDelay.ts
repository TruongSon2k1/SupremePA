import {JSonObject} from "../../../CC_pTS/JSon/JSonObject";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@ccclass('TSMDelayHelper')
export class TSMDelayHelper extends JSonObject
{
    @property({min: 0})
    amount_of_time: number = 0;

    protected __to_json?: () => string = () =>
    {
        return `
        {
            "amount_of_time": ${this.amount_of_time}
        }
        `
    }
}

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass("TSMDelay")
export class TSMDelay extends TSAMechanic
{
    @property({ override: true, type: TSMDelayHelper })
    optional: TSMDelayHelper = new TSMDelayHelper();

    _description_: string = "Delay amount of time.";

    get duration(): number 
    {
        return this.optional.amount_of_time;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        return action.delay(this.optional.amount_of_time)
    }

}

