import {IQuickFactoryManager} from "../../../Interfaces/IQuickFactoryManager";
import {FactoryManager} from "../../../pTS/Factory/FactoryManager";
import {fm_quick_reg, fm_quick_reg_to, force_override } from "../../../pTS/Support/Decorators";
import {TSRObject} from "../../Root/TSRObject";

const {ccclass, property} = cc._decorator;

@fm_quick_reg()
@ccclass('TSAMechanic')
export abstract class TSAMechanic extends TSRObject
{
    @property(
        {
            tooltip: ""
        }
    )
    active: boolean = true;

    //@property()
    //get duration(): number { return 0 };
    
    @property()
    get time_cost() { return this.duration }

    abstract get duration(): number;

    public gter(action: cc.Tween<any>): cc.Tween<any>
    {
        if(!this.active) return action;
    }

    protected abstract generator(action: cc.Tween<any>): cc.Tween<any>;
}

export const _TSQMecha_: IQuickFactoryManager = 
{
    string: "TSAMechanic",
    creator: FactoryManager.instance().get<TSAMechanic>("TSAMechanic"),
    generator: function (id: string) 
    {
        return FactoryManager.instance().get<TSAMechanic>("TSAMechanic").generate(id);
    }
}
