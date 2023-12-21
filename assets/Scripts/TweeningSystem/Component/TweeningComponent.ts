import {BaseMasterComponent} from "../../ExpertComponent/BaseMasterComponent";
import {TSBackendManager} from "../Core/Root/TSBackendManager";
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

    protected _backend_: TSBackendManager = null;

    init()
    {
        if(CC_EDITOR)
        {
            if (!this.information.main) 
            {
                this.information.main = this.node
            }
        }
        else
        {
            this._backend_ = TSBackendManager.create(this)
            console.log(this._backend_);
        }
    }

    protected update(dt: number): void 
    {
        if(CC_EDITOR) this.editor.updater();
        else this._backend_.update(dt)
    }

    onCollisionEnter(other: cc.Collider, self: cc.Collider)
    {
        this._backend_.enter_collision(other, self)
    }

    onCollisionExit(other: cc.Collider, self: cc.Collider)
    {
        this._backend_.exit_collision(other, self)
    }
}

