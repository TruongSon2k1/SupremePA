import {EasingAction} from "../Extender/EasingAction";
import {MA} from "./MA";
import {IMB, MB} from "./MB";
import {K, MC} from "./MC";

const {ccclass, property, mixins} = cc._decorator;

@ccclass
@mixins(MB, MC, MA, EasingAction)
//@ts-ignore
export class TestMixin extends cc.Component implements MB
{
    constructor() {
        super();
        MB.call(this);
        MA.call(this);
        MC.call(this);
        EasingAction.call(this);

        this['easing_list'] = EasingAction.prototype['easing_list'];
        //this['get mc'] = MC.prototype['get mc']
        //this['set mc'] = MC.prototype['set mc']
    }
    mb?: number;
    lmao?(): void;

    protected onLoad(): void {


    }

}


function xxxx(x: IMB)
{
    x.lmao()
}
