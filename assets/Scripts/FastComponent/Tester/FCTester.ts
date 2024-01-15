import {BaseMasterComponent} from "../../CC_pTS/ExpertComponent/BaseMasterComponent";
import {FCSelectHelper} from "./FCSelectHelper";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('FastComponent/Tester')
export class FCTester extends BaseMasterComponent
{
    @property(FCSelectHelper)
    helper: FCSelectHelper = new FCSelectHelper();

    @property([cc.Component])
    get list()
    {
        return this.helper.selecting_list;
    }
}
