import {ByTo} from "../Configer/Enum";
import {AEasingV3Action} from "./AEasingV3Action";

const {ccclass} = cc._decorator;

@ccclass('EXTScalingAction')
export default class EXTScalingAction extends AEasingV3Action
{
    public generate(action: cc.Tween<any>): cc.Tween<any> 
    {
        switch(this.type)
        {
            case ByTo.BY:
                action.by(this.duration, {scaleX: this.target.x, scaleY: this.target.y, scaleZ: this.target.z}, {easing: this.easing})
                break;
            case ByTo.TO:
                action.to(this.duration, {scaleX: this.target.x, scaleY: this.target.y, scaleZ: this.target.z}, {easing: this.easing})
                break;
        }
        return action;
    }
}
