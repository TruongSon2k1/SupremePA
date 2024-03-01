import {IJSonData} from "../../../CC_pTS/Interface/IJSONData";
import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {ITSEditorManager} from "../../Component/ITweeningComponent";
import {EditorMode} from "../../Helper/TSEnum";
import {editor_from_json, editor_json} from "../../Helper/TSJson";
import {TSConditionEditor} from "../Condition/TSConditionEditor";
import {TSMechanicEditor} from "../Mechanic/TSMechanicEditor";

const {ccclass, property} = cc._decorator;

@ccclass('TSEditorManager')
export class TSEditorManager extends BaseMasterClass implements ITSEditorManager
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

    /**
     * @description
     * | Only called at Editor Mode
     *
     */
    destroy()
    {
        this.condition.destroy();
        this.mechanic.destroy();
    }

    to_json(): string {
        return editor_json(this)
    }

    to_js_data(): IJSonData {
        return {
            type: cc.js.getClassName(this),
            data: this
        }
    }

    init_from_data(data: IJSonData): void 
    {
        const ret = editor_from_json(data);

        this.editor_mode = ret.editor_mode;
        
        this.condition.init_with_data(ret.condition)
        this.mechanic.init_with_data(ret.mechanic)
    }
}
