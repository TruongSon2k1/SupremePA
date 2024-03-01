import {JSonObject} from "../../../CC_pTS/JSon/JSonObject";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@ccclass('TSMSelfLogHelper')
export class TSMSelfLogHelper extends JSonObject
{
    @property()
    custom_string: string = ""

    generator(action: cc.Tween<any>): cc.Tween<any>
    {
        return action.call(() => { console.log(this.custom_string, action.getTarget().getPosition()) });
    }

    protected __to_json?: () => string = () =>
    {
        return `
        {
            "custom_string": "${this.custom_string}"
        }
        `
    }
}

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass('TSMSelfLog')
export class TSMSelfLog extends TSAMechanic
{
    @property({ override: true, type: TSMSelfLogHelper })
    optional: TSMSelfLogHelper = new TSMSelfLogHelper();

    get duration(): number 
    {
        return 0;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        return this.optional.generator(action);
    }

    _description_: string = "Invoke a custom log message to the console.";
}
