import {BaseMasterComponent} from "../../CC_pTS/ExpertComponent/BaseMasterComponent";
import {IJSonData} from "../../CC_pTS/Interface/IJSONData";
import {cc_support} from "../../CC_pTS/Support/CCSupporter";
import {TSBackendManager} from "../Core/Root/TSBackendManager";
import {TSEditorManager} from "../Editor/Root/TSEditorManager";
import {TSInformator} from "../Helper/TSInformator";
import {ts_to_json} from "../Helper/TSJson";
import {ITweeningComponent} from "./ITweeningComponent";

const {ccclass, property, executeInEditMode, menu, playOnFocus, help} = cc._decorator;

@ccclass
@executeInEditMode
@playOnFocus
@menu('ExpertComponent/TweeningComponent')
@help('https://github.com/TSernXGamee/SupremePA/wiki#tweeningsystem')
export class TweeningComponent extends BaseMasterComponent implements ITweeningComponent
{
    @property(TSInformator)
    information: TSInformator = new TSInformator();

    @property()
    _is_testing_: boolean = false;
    @property()
    get test_this() { return this._is_testing_ }
    set test_this(value: boolean) 
    {
        this._is_testing_ = value;
        if(value) this._execute_test()
        this._is_testing_ = false;
    }

    @property()
    get tj() { return false }
    set tj(value: boolean) 
    {
        if(value)  cc_support.json.save(this.to_json(), "db://assets/Assets/json/g.json")
    }

    @property(TSEditorManager)
    editor: TSEditorManager = new TSEditorManager();

    _execute_test()
    {
        const ret = cc.instantiate(this.node)
        const second = cc.instantiate(this.information.main)
        this.node.parent.addChild(ret);
        this.information.main.parent.addChild(second);
        let tws = ret.getComponents(TweeningComponent);
        for (const temp of tws) 
        {
            if (temp._is_testing_) 
            {
                temp.information.main = second;
                temp.__TEST_API(ret);
                return;
            }
        }
    }

    __TEST_API(ref: cc.Node)
    {
        const be = TSBackendManager.create(this)
        be._tween_.delay(1).call( () => {ref.destroy()} ).removeSelf()
        be.invoke();
    }

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

    protected pre_cleanup(): void 
    {
        if(CC_EDITOR)    
        {
            this.editor.destroy();
        }
    }

    to_js_data(): IJSonData {
        return {type: cc.js.getClassName(this), data: this}
    }

    to_json(): string {
        return ts_to_json(this);
    }

    init_from_data(data: IJSonData): void 
    {
        const ret = data.data;
        this.information.init_from_data(ret.information)
        this.editor.init_from_data(ret.editor)
    }
}

