import {IVec2} from "../../pTS/Math/IMath";
import {GPHelper} from "../Root/GPHelper";
import {GPCircle} from "./GPCircle";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('Graphic/One Line')
export class GPOneLine extends GPHelper
{

    @property({type: cc.Integer, min: 1, visible: false})
    physic_length: number = 10;

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
    _end_: cc.Vec2 = cc.v2()
    @property({ displayName: "End" , visible() { return !this._enable_help_ }})
    get pe() 
    {
        return this._end_ 
    }
    set pe(value: cc.Vec2)
    {
        if(this._end_ === value) return;
        this._end_ = value;    
        this.gender();
    }

    @property( { type: GPCircle,} )
    _sp_: GPCircle = null;              //< START
    @property( { type: GPCircle,} )
    _ep_: GPCircle = null;              //< END

    protected __init_helper(): void 
    {
        if(!this._sp_) this._sp_ = this.___gpcircle_creator("START", cc.Color.BLUE, this.node.convertToWorldSpaceAR(this._start_));
        if(!this._ep_) this._ep_ = this.___gpcircle_creator("END", cc.Color.BLUE, this.node.convertToWorldSpaceAR(this._end_));
    }

    protected __destroy_helper(): void 
    {
        this._sp_ = this.___gpcircle_destroyer(this._sp_)
        this._ep_ = this.___gpcircle_destroyer(this._ep_)
    }

    protected __generate_array_point(): IVec2[] 
    {
        return [{x: this.ps.x, y: this.ps.y}, {x: this.pe.x, y: this.pe.y}]
    }

    draw(): void 
    {
        const gp = this.graphic;
        gp.clear();
        gp.moveTo(this._start_.x,this._start_.y)
        gp.lineTo(this._end_.x, this._end_.y)
    }

    protected e_update(): void 
    {
        this.node.setPosition(0, 0)
        if(this._sp_) this.ps = this._sp_.position(this.node) as cc.Vec2;
        if(this._ep_) this.pe = this._ep_.position(this.node) as cc.Vec2;
    }
}
