import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {EditorMode} from "../../Helper/TSEnum";
import {TSConditionEditor} from "../Condition/TSConditionEditor";
import {TSMechanicEditor} from "../Mechanic/TSMechanicEditor";

const {ccclass, property} = cc._decorator;

@ccclass('TSEditorManager')
export class TSEditorManager extends BaseMasterClass 
{
    @property(
        {
            type: cc.Enum(EditorMode)
        }
    )
    editor_mode: EditorMode = EditorMode.CONDITION;

    @property(
        {
            type: TSConditionEditor,
            visible()
            {
                return this.editor_mode === EditorMode.CONDITION || this.editor_mode === EditorMode.BOTH
            }
        }
    )
    condition: TSConditionEditor = new TSConditionEditor();

    @property(
        {
            type: TSMechanicEditor,
            visible()
            {
                return this.editor_mode === EditorMode.MECHANIC || this.editor_mode === EditorMode.BOTH
            }
        }
    )
    mechanic: TSMechanicEditor = new TSMechanicEditor();

    updater()
    {
        switch(this.editor_mode)
        {
            case EditorMode.CONDITION:
                this.condition.updater();
                break;
            case EditorMode.MECHANIC:
                this.mechanic.updater();
            case EditorMode.BOTH:
                this.condition.updater();
                this.mechanic.updater();
                break;
        }
    }
}
