import {ByTo} from "../Configer/Enum";
import {AEasingV3Action} from "./AEasingV3Action";

const {ccclass} = cc._decorator;

@ccclass('EXTMovingAction')
export default class EXTMovingAction extends AEasingV3Action
{
    public generate(action: cc.Tween<any>): cc.Tween<any> 
    {
        switch(this.type)
        {
            case ByTo.BY:
                action.by(this.duration, {position: this.target}, {easing: this.easing})
                break;
            case ByTo.TO:
                action.to(this.duration, {position: this.target}, {easing: this.easing})
                break;
        }
        return action;
    }
}
