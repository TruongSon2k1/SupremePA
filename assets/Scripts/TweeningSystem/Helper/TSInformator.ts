import {IJSonData} from "../../CC_pTS/Interface/IJSONData";
import {BaseMasterClass} from "../../pTS/Root/Class/BaseMasterClass";
import {ITSInformator} from "../Component/ITweeningComponent";
import {ConditionType, ExecutionMode, ResetType} from "./TSEnum";
import {information_from_json, information_json} from "./TSJson";

const {ccclass, property} = cc._decorator;

@ccclass('TSInformator')
export class TSInformator extends BaseMasterClass implements ITSInformator
{

    @property(
        {

        }
    )
    details: string = "A NEW TWEENING COMPONENT"

    @property(
        {
            type: cc.Node
        }
    )
    main: cc.Node = null;

    @property(
        {
        }
    )
    silent_backend: boolean = true;

    @property(
        {
            type: cc.Enum(ConditionType)
        }
    )
    conditon_type: ConditionType = ConditionType.OR;

    @property(
        {
            type: cc.Enum(ResetType),
            visible() { return this.conditon_type === ConditionType.OR }
        }
    )
    reset_type: ResetType = ResetType.THIS;

    @property(
        {
            type: cc.Enum(ExecutionMode)
        }
    )
    mechanic_execution_mode: ExecutionMode = ExecutionMode.SEQUENCE;

    tween(): cc.Tween<any>
    {
        return cc.tween(this.main);
    }

    to_json(): string {
        return information_json(this);
    }

    to_js_data(): IJSonData {
        return {
            type: cc.js.getClassName(this),
            data: this
        }
    }

    init_from_data(data: IJSonData): void 
    {
        const ret = information_from_json(data);             

        this.details = ret.details;
        this.main = ret.main;
        this.silent_backend = ret.silent_backend
        this.conditon_type = ret.conditon_type;
        this.reset_type = ret.reset_type;
        this.mechanic_execution_mode = ret.mechanic_execution_mode;
    }


}
