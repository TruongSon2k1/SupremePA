import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {TSMechanicPreviewObject} from "../../Editor/Mechanic/TSMechanicPreviewObject";
import {TSAMechanic} from "./TSAMechanic";

export default class TSMechanicManager extends BaseMasterClass
{
    protected mechanics: TSAMechanic[] = [];

    set set(mechanics: TSAMechanic[])
    {
        this.mechanics = mechanics;
    }


    final_action(root_action: cc.Tween<any>): cc.Tween<any>
    {
        for(const ret of this.mechanics)
        {
            root_action = ret.gter(root_action);
        }
        return root_action;
    }

    invalid()
    {
        return this.mechanics.length <= 0
    }
    
    static create(list: TSMechanicPreviewObject[])
    {
        let ret = new TSMechanicManager(); 
        for(const temp of list) ret.mechanics.push(temp.action)
    }
}
