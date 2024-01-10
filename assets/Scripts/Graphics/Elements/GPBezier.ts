import {BezierCurvesType} from "../../Configer/Enum";
import {IVec2} from "../../pTS/Math/IMath";
import {math} from "../../pTS/Math/MathSupport";
import {GPHelper} from "../Root/GPHelper";
import {GPCircle} from "./GPCircle";

const {ccclass, property, menu} = cc._decorator;

/**
 * @deprecated Using `GPPBezier` for better performance.
 */
@ccclass
//@menu('Graphic/Bezier')
export class GPBezier extends GPHelper 
{

    @property(
        {
            type: cc.Enum(BezierCurvesType)
        }
    )
    curve_type: BezierCurvesType = BezierCurvesType.BEZIER;

    protected __init_helper()
    {
        if(!this._sp_) this._sp_ = this.___gpcircle_creator("START", cc.Color.RED, this.node.convertToWorldSpaceAR(this._start_));
        if(!this._mp_) this._mp_ = this.___gpcircle_creator("MID", cc.Color.GREEN, this.node.convertToWorldSpaceAR(this._mid_));
        if(!this._ep_) this._ep_ = this.___gpcircle_creator("END", cc.Color.RED, this.node.convertToWorldSpaceAR(this._end_));
    }

    protected __destroy_helper()
    {
        this._sp_ = this.___gpcircle_destroyer(this._sp_)
        this._mp_ = this.___gpcircle_destroyer(this._mp_)
        this._ep_ = this.___gpcircle_destroyer(this._ep_)
    }

    @property( { type: GPCircle,} )
    _sp_: GPCircle = null;              //< START
    @property( { type: GPCircle,} )
    _mp_: GPCircle = null;              //< MID
    @property( { type: GPCircle,} )
    _ep_: GPCircle = null;              //< END

    protected __generate_array_point(): IVec2[] 
    {
        switch(this.curve_type)
        {
            case BezierCurvesType.BEZIER:
                return math.berize_curve({sp: this.ps, mp: this.pm, ep: this.pe}, this.physic_length);
            case BezierCurvesType.QUAD:
                return math.berize_curve({sp: this.ps, mp: this.pm, ep: this.pe}, this.physic_length);
        }
    }

    @property()
    _start_: cc.Vec2 = cc.v2()
    @property({ displayName: "Start", visible() { return !this._enable_help_ } })
    get ps() 
    {
        return this._start_
    }
    set ps(value: cc.Vec2)
    {
        if(this._start_ === value) return;
        this._start_ = value;    
        this.gender();
    }

    @property()
    _mid_: cc.Vec2 = cc.v2()
    @property({ displayName: "Mid" , visible() { return !this._enable_help_ }})
    get pm() 
    {
        return this._mid_ 
    }
    set pm(value: cc.Vec2)
    {
        if(this._mid_ === value) return;
        this._mid_ = value;    
        this.gender();
    }

    @property()
    _end_: cc.Vec2 = cc.v2()
    @property({ displayName: "End" , visible() { return !this._enable_help_ }})
    get pe() 
    {
        return this._end_ 
    }
    set pe(value: cc.Vec2)
    {
        if(this._mid_ === value) return;
        this._end_ = value;    
        this.gender();
    }

    draw(): void 
    {
        const gp = this.graphic;
        gp.clear();
        gp.moveTo(this._start_.x,this._start_.y)
        switch(this.curve_type)
        {
            case BezierCurvesType.BEZIER:
                gp.bezierCurveTo(this._start_.x, this._start_.y, this._mid_.x, this._mid_.y, this._end_.x, this._end_.y);
                break;
            case BezierCurvesType.QUAD:
                gp.quadraticCurveTo(this._mid_.x, this._mid_.y, this._end_.x, this._end_.y)
                break;
        }
    }

    protected e_update(dt: number): void 
    {
        this.node.setPosition(0, 0)
        if(this._sp_) this.ps = this._sp_.position(this.node) as cc.Vec2;
        if(this._ep_) this.pe = this._ep_.position(this.node) as cc.Vec2;
        if(this._mp_) this.pm = this._mp_.position(this.node) as cc.Vec2;
    }
}
