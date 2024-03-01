import {constant} from "../CC_pTS/Constant/Constanst";
import {AVec3Action} from "./AVec3Action";
import {EasingAction} from "./EasingAction";

const {ccclass, property} = cc._decorator;

@ccclass('AEasingV3Action')
export abstract class AEasingV3Action extends AVec3Action implements EasingAction
{
    @property()
    easing: string = "linear";

    @property()
    show_less: boolean = false;

    @property({type: [cc.String], visible() { return !this.show_less }})
    get easing_list()
    {
        return constant.easing_list;
    }

}
