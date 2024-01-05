import {BaseMasterComponent} from "../CC_pTS/ExpertComponent/BaseMasterComponent";
import {cc_support} from "../CC_pTS/Support/CCSupporter";

const {ccclass, property, inspector} = cc._decorator;

@ccclass
export class SmartFinder extends BaseMasterComponent
{
    @property(cc.SceneAsset)
    _scene_: cc.SceneAsset = null;

    @property(
        {
            type: cc.SceneAsset,
            visible() { return !this._node_ },
        }
    )
    get target_scene() { return this._scene_ }
    set target_scene(value) 
    {
        if(value === this._scene_) return;
        this._scene_ = value;
    }

    @property(cc.Node)
    _node_: cc.Node = null;

    @property(
        {
            type: cc.Node,
            visible() { return !this._scene_ },
        }
    )
    get target_node() { return this._node_ }
    set target_node(value)
    {
        if(value === this._node_) return;
        this._node_ = value;    
    }

    @property()
    search: string = ""

    @property({ visible() { return this.search } })
    get button() { return false }
    set button(value: boolean)
    {
        if(value) this.do_search();
    }

    @property(
        {
            type: cc.Component.EventHandler,
            visible() { return !!this.event.target }
        }
    )
    event: cc.Component.EventHandler = new cc.Component.EventHandler();

    do_search()
    {
        if(!this.search) { this.log("Please put something in the 'search bar' to search"); return; }

        let comp: cc.Component = null;

        if(this._scene_) comp = cc_support.component.find_component(this._scene_.scene, this.search);
        else if(this._node_) comp = cc_support.component.find_component(this._node_, this.search); 
        else comp = cc_support.component.find_component(cc.director.getScene(), this.search);

        this.setup_event(comp);
    }

    setup_event(comp: cc.Component)
    {
        if(!comp) return;

        this.event.target = comp.node;
        this.event.handler = comp.name;
    }

    init()
    {
        console.log(this.event)
    }
}
