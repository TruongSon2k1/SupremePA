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
    _type_: ByTo = ByTo.BY;
    @property(
        {
            type: cc.Enum(ByTo)
        }
    )
    get type() { return this._type_ }
    set type(value) 
    {
        this._type_ = value
        this.on_change_type();
    }
        
    on_change_type() {}


    public abstract generate(action: cc.Tween<any>): cc.Tween<any>
}
