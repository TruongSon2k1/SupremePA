import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {TweeningComponent} from "../../Component/TweeningComponent";
import {TSEditorManager} from "../../Editor/Root/TSEditorManager";
import {TSInformator} from "../../Helper/TSInformator";
import {TSAConditionManager} from "../Condition/TSConditionManager";
import TSMechanicManager from "../Mechanic/TSMechanicManager";

export class TSBackendManager extends BaseMasterClass
{
    condition_manager: TSAConditionManager = null;
    mechanic_manager: TSMechanicManager = null;    

    _tween_: cc.Tween<any> = null;

    public static create(ts: TweeningComponent)
    {
        let ret = new TSBackendManager();
        const inform = ts.information;
        const editor = ts.editor;

        ret._tween_ = inform.tween();

        ret.condition_manager = editor.condition.to_manager(inform.conditon_type, inform.reset_type, inform.silent_backend);
        ret.mechanic_manager = editor.mechanic.to_manager();

        if(!ret.ctor(ts)) return null;

        return ret;
    }

    public ctor(ts_ref: TweeningComponent): boolean
    {
        if(!this.condition_manager.ctor()) 
        {
            this.warn("There is no `Condtition` to execute the action. Ref: ", ts_ref)
            return false;
        }

        if(!this.mechanic_manager.valid())
        {
            this.warn("There is no `Mechanic` to be called at the runtime, please add some. Ref: ", ts_ref)
            return false;
        }

        this._tween_ = this.mechanic_manager.final_action(this._tween_);

        this.auto_invoke();

        return true;
    }

    protected auto_invoke()
    {
        if(this.condition_manager.is_valid) this._tween_.start();
    }

    public update(dt: number): void
    {
        this.condition_manager.update(dt)
        this.auto_invoke();
    }

    enter_collision(other: cc.Collider, self: cc.Collider) { this.condition_manager.enter_collision(other, self) }
    exit_collision(other: cc.Collider, self: cc.Collider) { this.condition_manager.exit_collision(other, self) }

}
