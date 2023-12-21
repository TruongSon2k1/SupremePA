import {BaseMasterClass} from "../../pTS/Root/Class/BaseMasterClass";
import {ConditionType, ExecutionMode} from "./TSEnum";

const {ccclass, property} = cc._decorator;

@ccclass('TSInformator')
export class TSInformator extends BaseMasterClass
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
            type: cc.Enum(ExecutionMode)
        }
    )
    mechanic_execution_mode: ExecutionMode = ExecutionMode.SEQUENCE;

    _action_: cc.Tween<any> = null;
}
