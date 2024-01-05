import {cc_support} from "../../CC_pTS/Support/CCSupporter";
import {GPCore} from "../Root/GPCore";

const {ccclass, property, menu} = cc._decorator;

@ccclass
@menu('Graphic/Circle')
export class GPCircle extends GPCore
{
    @property()
    _rad_: number = 10;
    @property(
        {
            min: 0,
            displayName: "Radius"
        }
    )
    get rad() { return this._rad_ }
    set rad(value: number) 
    {
        this._rad_ = value
        this.node.setContentSize(this.rad*2, this.rad*2);
        this.gender();
    }

    @property()
    _offset_: cc.Vec2 = cc.v2();
    @property()
    get offset() { return this._offset_ }
    set offset(value: cc.Vec2)
    {
        this._offset_ = value;
        this.gender()
    }

    protected __generate_collider(): void 
    {
        cc_support.component.get_component(this.node, cc.CircleCollider).radius = this._rad_;
    }

    protected __destroy_collider(): void 
    {
        this.node.removeComponent(cc.CircleCollider);
    }

    protected __generate_physic(): void 
    {
        cc_support.component.get_component(this.node, cc.PhysicsCircleCollider).radius = this._rad_;
    }

    protected __destroy_physic(): void 
    {
        this.node.removeComponent(cc.PhysicsCircleCollider);
        this.node.removeComponent(cc.RigidBody)
    }

    draw(): void 
    {
        this.graphic.clear();
        this.graphic.circle(this.offset.x, this.offset.y, this._rad_);

    }

    position(node: cc.Node = null, is_v3: boolean = false): cc.Vec2 | cc.Vec3
    {
        let pos: cc.Vec3 = this.node.position;
        if(node) 
        {
            let p1 = this.node.convertToWorldSpaceAR(cc.v3(0,0))
            pos = node.parent.convertToNodeSpaceAR(p1)
        }
        if(is_v3) return pos;
        else return cc.v2(pos);
    }
}
