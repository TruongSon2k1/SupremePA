import {IJSonData} from "../../../CC_pTS/Interface/IJSONData";
import {ITSMechanicPreviewObject} from "../../Component/ITweeningComponent";
import {TSAMechanic, _TSQMecha_} from "../../Core/Mechanic/TSAMechanic";
import {TSAObjectPreviewHelper} from "../Root/TSAObjectPreviewHelper";

const {ccclass, property} = cc._decorator;

@ccclass('TSMechanicPreviewObject')
export class TSMechanicPreviewObject extends TSAObjectPreviewHelper implements ITSMechanicPreviewObject
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

