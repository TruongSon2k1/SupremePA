import {AntiDuplicateLevel} from "../ExpertComponent/BaseMasterComponent";
import {ClickEventHelper} from "../ExpertComponent/ClickEventHelper";
import {mark_cc_singleton} from "../Support/CCDecorator";
import {cc_support} from "../Support/CCSupporter";

const {ccclass, property, executeInEditMode} = cc._decorator;

@mark_cc_singleton
@ccclass
@executeInEditMode
export class ColliderTouch extends ClickEventHelper
{
    protected anti_duplicate: AntiDuplicateLevel = AntiDuplicateLevel.SINGLETON;

    _collision_: cc.Node = null;
    _moving_: boolean = false;

    @property(
        {
            min: 0.000001,
        }
    )
    radius: number = 12;

    @property()
    _canvas_: cc.Canvas = null;

    
    init()
    {
        if(!CC_EDITOR) this.__init_collision();
        else this.__init_size();
    }

    private __init_size()
    {
        this._canvas_ = cc_support.component.find_component(cc.director.getScene(), cc.Canvas)
        const size = this._canvas_.designResolution;
        this.node.setContentSize(size.width * 3, size.height * 3); 
    }

    private __init_collision()
    {
        const cs = this._canvas_.designResolution;
        this._collision_ = new cc.Node('TOUCH-COLLISION');
        this._collision_.setPosition(cs.width * 5, cs.height * 5);
        this._collision_.group = this.node.group;

        const ccc = this._collision_.addComponent(cc.CircleCollider);
        ccc.radius = this.radius;
        this.node.addChild(this._collision_);
        this._collision_.active = false 
    }

    onMouseDown(event: any): void 
    {
        this._moving_ = true;
        this._collision_.active = true;
        this._collision_.position = this.node.convertToNodeSpaceAR(event.touch.getLocation());
    }

    onMouseMove(event: any): void 
    {
        if(this._moving_) this._collision_.position = this.node.convertToNodeSpaceAR(event.touch.getLocation())
    }

    onMouseUp(event: any): void 
    {
        this.reset();
    }

    reset()
    {
        this._moving_ = false;

        this._collision_.active = false;
    }
}
