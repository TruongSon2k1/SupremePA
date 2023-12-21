import {ByTo} from "../Configer/Enum";

const {property} = cc._decorator;

export abstract class AVec3Action 
{
    @property()
    target: cc.Vec3 = cc.v3();

    @property(
        {
            min: 0
        }
    )
    duration: number = 0;

    @property(
        {
            type: cc.Enum(ByTo)
        }
    )
    type: ByTo = ByTo.BY;

    public abstract generate(action: cc.Tween<any>): cc.Tween<any>
}
