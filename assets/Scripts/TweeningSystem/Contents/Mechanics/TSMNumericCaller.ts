import {CallbackManager} from "../../../pTS/Callback/CallbackManager";
import {global_callback} from "../../../pTS/Callback/GlobalCallback";
import {fm_quick_reg_to} from "../../../pTS/Support/Decorators";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";

const {ccclass, property} = cc._decorator;

@fm_quick_reg_to(_TSQMecha_.string)
@ccclass('TSMNumericCaller')
export class TSMNumericCaller extends TSAMechanic
{
    @property(
        {
            type: cc.Integer
        }
    )
    amount: number = 1;

    @property([cc.String])
    ids: string[] = [];

    get duration(): number 
    {
        return 0;
    }

    protected generator(action: cc.Tween<any>): cc.Tween<any> 
    {
        let arr: CallbackManager[] = []
        for(const ret of this.ids)
        {
            const t = global_callback.get(ret);
            if (t) arr.push(t);
        }

        action.call( () =>
                    {
                        for(const ret of arr)
                            {
                                ret.invoke(this.amount)
                            }
                    })
                    return action;
    }
    _description_: string = "...";
}
