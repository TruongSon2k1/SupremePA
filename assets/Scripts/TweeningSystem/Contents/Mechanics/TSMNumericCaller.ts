import {GS} from "../../../pTS/Signal/GlobalSignal";
import {SignalManager} from "../../../pTS/Signal/SignalManager";
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
        action.call( () =>
        {
        let arr: SignalManager[] = []
        for(const ret of this.ids)
        {
            //const t = global_callback.get(ret);
            const t = GS.signal.get({id: ret, safe: true});
            console.log(t)
            if (t) arr.push(t);
        }
            for (const ret of arr) {
                ret.execute(this.amount)
            }
        })
        return action;
    }

    _description_: string = `Increase amount of a 'NSCallerHelper' registered with the given id.`;
}
