import {TSACondition, _TSQCond_} from "../../Core/Condition/TSACondition";
import {TSAObjectPreviewHelper} from "../Root/TSAObjectPreviewHelper";

const {ccclass, property} = cc._decorator;

@ccclass('TSConditionPreviewObject')
export class TSConditionPreviewObject extends TSAObjectPreviewHelper
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
}
