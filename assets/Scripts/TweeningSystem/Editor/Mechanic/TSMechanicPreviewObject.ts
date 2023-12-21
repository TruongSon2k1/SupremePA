import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";
import {TSAObjectPreviewHelper} from "../Root/TSAObjectPreviewHelper";

const {ccclass, property} = cc._decorator;

@ccclass('TSMechanicPreviewObject')
export class TSMechanicPreviewObject extends TSAObjectPreviewHelper
{
    @property(
        {
            type: TSAMechanic,
            tooltip: "",
            displayName: "Mechanics",
            override: true
        }
    )
    action: TSAMechanic = null;

    public static create(id: string, index: number)
    {
        let ret = new TSMechanicPreviewObject();
        ret.action = _TSQMecha_.generator(id);
        ret.index = index;
        return ret;
    }
}
