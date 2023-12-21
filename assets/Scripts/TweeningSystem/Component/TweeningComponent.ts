import {BaseMasterComponent} from "../../ExpertComponent/BaseMasterComponent";
import {TSMechanicEditor} from "../Editor/Mechanic/TSMechanicEditor";
import {TSEditorManager} from "../Editor/Root/TSEditorManager";
import {TSInformator} from "../Helper/TSInformator";

const {ccclass, property, executeInEditMode, menu} = cc._decorator;

@ccclass
@executeInEditMode
@menu('ExpertComponent/TweeningComponent')
export class TweeningComponent extends BaseMasterComponent
{
    @property(TSInformator)
    information: TSInformator = new TSInformator();
    @property(TSEditorManager)
    editor: TSEditorManager = new TSEditorManager();

    init()
    {
        if(CC_EDITOR)
        {
            if (!this.information.main) 
            {
                this.information.main = this.node
            }
        }
    }

    protected update(): void 
    {
        if(CC_EDITOR) this.editor.updater();
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)
    {
    }
}

