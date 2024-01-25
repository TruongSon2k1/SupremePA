import {Node2DInformation} from "../CC_pTS/Helper/NodeInformation";
import {cc_support} from "../CC_pTS/Support/CCSupporter";

const {ccclass, property} = cc._decorator;
@ccclass
export class JSONReader extends cc.Component 
{
    @property(cc.JsonAsset)
    _js_: cc.JsonAsset = null;
    @property(cc.JsonAsset)
    set json(value)
    {
        this._js_ = value;
        const constructor =  cc.js.getClassByName(value.json.type)
        if(value) this.data = cc_support.json.parser<Node2DInformation>(value.json, constructor['json_reviver']);

    }
    get json() { return this._js_ }

    @property()
    data: Node2DInformation = null


}
