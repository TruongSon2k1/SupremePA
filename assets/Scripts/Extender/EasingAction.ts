import {constant} from "../CC_pTS/Constant/Constanst";

const {ccclass, property} = cc._decorator;

@ccclass("EasingAction")
export class EasingAction
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
