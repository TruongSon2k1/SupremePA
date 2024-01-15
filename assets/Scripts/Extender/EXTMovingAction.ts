import {ByTo, MovingType} from "../Configer/Enum";
import {GPOneLine} from "../Graphics/Elements/GPOneLine";
import {GPPBezier} from "../Graphics/Elements/GPPBezier";
import {IMovingAction} from "../Interfaces/IMovingAction";
import {AEasingV3Action} from "./AEasingV3Action";

const {ccclass, property} = cc._decorator;

@ccclass('EXTMovingHelper')
abstract class EXTMovingHelper
{
    //@property(
    //    {
    //        tooltip: "Mark this action to be reversed."
    //    }
    //)
    //reverse: boolean = false;

    @property({type: cc.Enum(ByTo)})
    _byto_: ByTo = ByTo.BY;
    set byto(value: ByTo) 
    {
        this._byto_ = value;
        if(value === ByTo.BY) this.__disable_helper();
    }

    @property()
    _enable_helper_: boolean = false;
    @property()
    get enable_helper() { return this._enable_helper_ }
    set enable_helper(value: boolean) 
    {
        this._enable_helper_ = value;
        if(value) this.__on_enable_helper();
        else this.__disable_helper();

    }

    protected abstract __on_enable_helper(): void;
    protected abstract __disable_helper(): void;

    abstract generate(tween: cc.Tween<any>, option: IMovingAction): cc.Tween<any>;
    abstract e_updater(): void;
}

@ccclass('EXTLinearMovingHelper')
class EXTLinearMovingHelper extends EXTMovingHelper
{

    @property(
        {
            type: GPOneLine
        }
    )
    helper: GPOneLine = null;

    protected __on_enable_helper(): void 
    {
        const node = new cc.Node('HELPER')
    
        this.helper = node.addComponent(GPOneLine)
        cc.director.getScene().addChild(node)
    }

    protected __disable_helper(): void 
    {
        
    }

    e_updater(): void 
    {
        if(this.enable_helper && this.helper)
        {
        }
    }


    generate(tween: cc.Tween<any>, option: IMovingAction): cc.Tween<any>
    {
        switch(option.type)
        {
            case ByTo.BY:
                tween.by(option.duration, {position: option.target}, {easing: option.easing})
                break;
            case ByTo.TO:
                tween.to(option.duration, {position: option.target}, {easing: option.easing})
                break;
        }
        //if(this.reverse) tween.reverseTime();
        return tween;
    }
}

@ccclass('EXTBezierMovingHelper')
class EXTBezierMovingHelper extends EXTMovingHelper
{
    
    @property(
        {
            type: GPPBezier
        }
    )
    helper: GPPBezier = null;

    @property()
    _node_: cc.Node = null;
    @property(cc.Node)
    get node() { return this._node_ }
    set node(v: cc.Node) 
    {
        if(!v)
            {
                this._node_.removeFromParent(true); 
                this.helper.destroy();
                this.helper = null;
            }

        this._node_ = v 
        if(CC_EDITOR)Editor.log(cc.director.getScene().childrenCount)
    }

    protected __on_enable_helper(): void 
    {
        this.node = new cc.PrivateNode('EXTBEzierMovingHelper')
        this.helper = this._node_.addComponent(GPPBezier);
        cc.director.getScene().addChild(this._node_)
        const s = cc.view.getCanvasSize();
        this._node_.setPosition(s.width/2, s.height/2)
        if(CC_EDITOR)Editor.log(cc.director.getScene().childrenCount)
    }

    protected __disable_helper(): void 
    {
        this.helper.destroy();
        this.helper = null
        this._node_.destroy();
    }

    e_updater(): void 
    {

    }

    @property({displayName: "START"})
    tempo_1: cc.Vec2 = cc.v2()

    @property({displayName: "MID"})
    tempo_2: cc.Vec2 = cc.v2()

    generate(tween: cc.Tween<any>, option: IMovingAction): cc.Tween<any>
    {
        switch(option.type)
        {
            case ByTo.BY:
                tween.bezierBy(option.duration, this.tempo_1, this.tempo_2, cc.v2(option.target))
                break;
            case ByTo.TO:
                tween.bezierTo(option.duration, this.tempo_1, this.tempo_2, cc.v2(option.target))
                break;
        }
        //if(this.reverse) tween.reverseTime();
        return tween;
    }
}

@ccclass('EXTMovingAction')
export default class EXTMovingAction extends AEasingV3Action
{
    on_change_type(): void 
    {
        this.movement.byto = this._type_;    
    }
    @property({ type: cc.Enum(MovingType) })
    _moving_type_: MovingType = MovingType.LINEAR;
    @property({ type: cc.Enum(MovingType) })
    get moving_type() { return this._moving_type_ }
    set moving_type(value: MovingType)
    {
        this._moving_type_ = value;
        this.movement = this.movement_creator();
    }

    @property(
        {
            type: EXTMovingHelper,
            visible() 
            {
                return !!this.movement;
            },
            tooltip: "Determines how this action should be handled."
        }
    )
    movement: EXTMovingHelper = this.movement_creator() 

    movement_creator()
    {
        switch(this._moving_type_)
        {
            case MovingType.LINEAR:
                return new EXTLinearMovingHelper();
            case MovingType.BEZIER:
                return new EXTBezierMovingHelper();
        }
    }

    public generate(action: cc.Tween<any>): cc.Tween<any> 
    {
        return this.movement.generate(action, {
                type: this.type,
                duration: this.duration,
                target: this.target,
                easing: this.easing
            })
    }

    e_updater()
    {
        this.movement.e_updater();
    }

}
