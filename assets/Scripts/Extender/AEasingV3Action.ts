import {constant} from "../CC_pTS/Constant/Constanst";
import {AVec3Action} from "./AVec3Action";
import {EasingAction} from "./EasingAction";

const {ccclass, property} = cc._decorator;

@ccclass('AEasingV3Action')
export abstract class AEasingV3Action extends AVec3Action implements EasingAction
{
    @property()
    easing: string = 'linear';

    @property()
    show_less: boolean = false;

    @property({type: [cc.String]})
    _list_: string[] = [];
    @property({type: [cc.String], visible() { return !this.show_less }})
    get easing_list()
    {
        if(this._list_.length != constant.easing_list.length) this._list_ = constant.easing_list;
        return this._list_;
    }
}
