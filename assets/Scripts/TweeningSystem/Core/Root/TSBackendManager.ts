import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {TSConditionEditor} from "../../Editor/Condition/TSConditionEditor";
import {TSMechanicEditor} from "../../Editor/Mechanic/TSMechanicEditor";
import {TSAConditionManager} from "../Condition/TSConditionManager";
import TSMechanicManager from "../Mechanic/TSMechanicManager";

export class TSBackendManager extends BaseMasterClass
{
    condition_manager: TSAConditionManager = null;
    mechanic_manaher: TSMechanicManager = null;    

    _action_: cc.Tween<any> = null;

    public static create(root: cc.Tween<any>, editor: TSConditionEditor, mechanic: TSMechanicEditor)
    {
        let ret = new TSBackendManager();

        ret._action_ = root;
        //ret.condition_manager = editor.to_manager(type)
    }
}
