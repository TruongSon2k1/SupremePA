import {pTSMath} from "../../pTS/Math/Fraction";
import {GPCore} from "../Root/GPCore";
import {GPCircle} from "./GPCircle";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('Graphic/Bezier')
export class GPBezier extends GPCore
{
    @property()
    _enable_help_: boolean = false;
    @property()
    get enable_help() { return this._enable_help_; }
    set enable_help(value: boolean) 
    {
        this._enable_help_ = value;
        if(value) this.__init_helper()
            else this.__destroy_helper();
    }

    __init_helper()
    {
        if(!this._sp_) this._sp_ = this.___gpcircle_creator("START", cc.Color.RED, this.node.parent.convertToWorldSpaceAR(this._start_));
        if(!this._mp_) this._mp_ = this.___gpcircle_creator("MID", cc.Color.GREEN, this.node.parent.convertToWorldSpaceAR(this._mid_));
        if(!this._ep_) this._ep_ = this.___gpcircle_creator("END", cc.Color.RED, this.node.parent.convertToWorldSpaceAR(this._end_));
    }

    /**
     * @param {string} name Name of the node.
     * @param {cc.Color} color Color of the graphic.
     * @param {cc.Vec2} init_pos The world init position.
     *
     * @private
     */
    private ___gpcircle_creator(name: string, color: cc.Color, init_pos: cc.Vec2)
    {
        let node = new cc.Node(name);
        const gp = node.addComponent(GPCircle);

        gp.graphic.fillColor = color;
        gp.rad = 16;

        this.node.parent.addChild(node)
        node.setPosition(this.node.parent.convertToNodeSpaceAR(init_pos));
        return gp;
    }

    __destroy_helper()
    {
        this._sp_ = this.___gpcircle_destroyer(this._sp_)
        this._mp_ = this.___gpcircle_destroyer(this._mp_)
        this._ep_ = this.___gpcircle_destroyer(this._ep_)
    }

    private ___gpcircle_destroyer(gp: GPCircle)
    {
        gp.node.destroy()
        gp.destroy();
        return null;
    }

    @property( { type: GPCircle,} )
    _sp_: GPCircle = null;              //< START
    @property( { type: GPCircle,} )
    _mp_: GPCircle = null;              //< MID
    @property( { type: GPCircle,} )
    _ep_: GPCircle = null;              //< END

    @property()
    _add_physic_: boolean = false;
    @property()
    get add_physic() { return this._add_physic_ }
    set add_physic(value: boolean)
    {
        this._add_physic_ = value;
        if(value) this.__add_physic();
        else this.__destroy_physic();
    }

    private __add_physic()
    {
    }

    private __destroy_physic()
    {

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
        this._end_ = value;    
        this.gender();
    }

    draw(): void 
    {
        const gp = this.graphic;
        gp.clear();
        gp.moveTo(this._start_.x,this._start_.y)
        gp.bezierCurveTo(this._start_.x, this._start_.y, this._mid_.x, this._mid_.y, this._end_.x, this._end_.y);
    }

    protected e_update(dt: number): void 
    {
        if(this._sp_) this.ps = this._sp_.position(this.node) as cc.Vec2;
        if(this._ep_) this.pe = this._ep_.position(this.node) as cc.Vec2;
        if(this._mp_) this.pm = this._mp_.position(this.node) as cc.Vec2;
    }
}
