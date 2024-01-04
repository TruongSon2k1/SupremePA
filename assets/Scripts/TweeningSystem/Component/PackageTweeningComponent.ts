import {BaseMasterComponent} from "../../CC_pTS/ExpertComponent/BaseMasterComponent";
import {TSBackendManager} from "../Core/Root/TSBackendManager";
import {TSEditorManager} from "../Editor/Root/TSEditorManager";
import {TSInformator} from "../Helper/TSInformator";
import {ITweeningComponent} from "./ITweeningComponent";

const {ccclass, property, executeInEditMode, menu, inspector, playOnFocus} = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
//@menu('ExpertComponent/PackageTweeningComponent')
@inspector('packages://pts-tween/inspector/tween_spector.js')
export class PackageTweeningComponent extends BaseMasterComponent implements ITweeningComponent
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
