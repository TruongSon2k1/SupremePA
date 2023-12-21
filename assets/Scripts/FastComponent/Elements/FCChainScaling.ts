import EXTScalingAction from "../../Extender/EXTScalingAction";
import {FCChainAction} from "../Root/FCChainAction";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('FastComponent/Chain/Scaling')
export default class FCChainScaling extends FCChainAction
{
    @property(
        {
            type: [EXTScalingAction],
            override: true,
            tooltip: "Add action for this `FastComponent`"
        }
    )
    actions: EXTScalingAction[] = []

    protected get time_cost(): number 
    {
        let total: number = 0
        for(const ret of this.actions)
        {
            total += ret.duration;
        }
        return total;
    }

    protected _generate_actions(): void 
    {
        for(const ret of this.actions)
        {
            ret.generate(this._action_);
            this.node.scale
        }
    }
}
