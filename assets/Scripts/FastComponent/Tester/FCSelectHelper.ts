import {SelectorHelper} from "../../CC_pTS/Helper/SelectorHelper";
import {FastComponent} from "../Root/FastComponent";

const {ccclass} = cc._decorator;

@ccclass('FCSelectHelper')
export class FCSelectHelper extends SelectorHelper<FastComponent>
{
    protected __get_comps_list(): FastComponent[] 
    {
        return this._target_.getComponents(FastComponent);
    }

    
}
