import {ByTo, MovingType} from "../Configer/Enum";
import {IBezierAction, IMovingAction} from "../Interfaces/IMovingAction";
import {AEasingV3Action} from "./AEasingV3Action";

const {ccclass, property} = cc._decorator;

@ccclass('EXTMovingHelper')
abstract class EXTMovingHelper
{
    abstract generate(tween: cc.Tween<any>, option: IMovingAction): cc.Tween<any>;
}

@ccclass('EXTLinearMovingHelper')
class EXTLinearMovingHelper extends EXTMovingHelper
{
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
        return tween;
    }
}

@ccclass('EXTBezierMovingHelper')
class EXTBezierMovingHelper extends EXTMovingHelper
{
    @property()
    tempo_1: cc.Vec2 = cc.v2()

    @property()
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
        return tween;
    
    }
}

@ccclass('EXTMovingAction')
export default class EXTMovingAction extends AEasingV3Action
{

    @property({ type: cc.Enum(MovingType) })
    _moving_type_: MovingType = MovingType.LINEAR;
    @property({ type: cc.Enum(MovingType) })
    get moving_type() { return this._moving_type_ }
    set moving_type(value: MovingType)
    {
        this._moving_type_ = value;
        this.movement = this.movement_creator();
    }

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

    @property(
        {
            type: EXTMovingHelper,
            visible() 
            {
                return !!this.movement;
            }
        }
    )
    movement: EXTMovingHelper = this.movement_creator() 

    public generate(action: cc.Tween<any>): cc.Tween<any> 
    {
        return this.movement.generate(action, {
                type: this.type,
                duration: this.duration,
                target: this.target,
                easing: this.easing
            })
    }

}
