import {IJSonData} from "../../../CC_pTS/Interface/IJSONData";
import {ITSConditionPreviewObject} from "../../Component/ITweeningComponent";
import {TSACondition, _TSQCond_} from "../../Core/Condition/TSACondition";
import {TSAObjectPreviewHelper} from "../Root/TSAObjectPreviewHelper";

const {ccclass, property} = cc._decorator;

@ccclass('TSConditionPreviewObject')
export class TSConditionPreviewObject extends TSAObjectPreviewHelper implements ITSConditionPreviewObject
{

    @property(
        {
            override: true,
            type: TSACondition
        }
    )
    action: TSACondition = null;
    
    public static create(id: string, index: number): TSConditionPreviewObject
    {
        let ret = new TSConditionPreviewObject();
        ret.action = _TSQCond_.generator(id);
        ret.index = index;
        return ret;
    }

    to_json(): string {
        return this.action.to_json()
    }

    to_js_data(): IJSonData {
        return {
            type: cc.js.getClassName(this),
            data: this
        }
    }

    init_from_data(data: IJSonData): void {

    }
}
