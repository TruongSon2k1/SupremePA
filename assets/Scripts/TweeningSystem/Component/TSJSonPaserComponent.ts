import {IJSonData} from "../../CC_pTS/Interface/IJSONData";
import {ITweeningComponent} from "./ITweeningComponent";

const {ccclass, property} = cc._decorator;

@ccclass
export class TSJSonPaserComponent extends cc.Component 
{
    @property(cc.JsonAsset)
    _json_: cc.JsonAsset = null

    @property(cc.JsonAsset)
    get json() { return this._json_ }
    set json(value: cc.JsonAsset)
    {
        this._json_ = value;
        if(value)
        {
            this.paser(value.json)
        }
    }

    paser(json: IJSonData)
    {
        const ts = this.node.addComponent(json.type) as ITweeningComponent;
        ts.init_from_data(json);
    }

}
