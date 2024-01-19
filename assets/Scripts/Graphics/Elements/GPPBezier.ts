import {IDrawer3P} from "../../CC_pTS/Packages/Intefaces/IPackagesDrawer";
import {cc_support} from "../../CC_pTS/Support/CCSupporter";
import {math} from "../../pTS/Math/MathSupport";
import {PhysicType} from "../Root/GPHelper";
import {GPPCore} from "../Root/GPPCore";

const {ccclass, property, menu, executeInEditMode} = cc._decorator;

@ccclass
@menu('Graphic/Package Bezier')
@executeInEditMode
export class GPPBezier extends GPPCore implements IDrawer3P
{
    @property({ type: cc.Integer, min: 10 })
    physic_jumper: number = 50;

    @property({ type: cc.Enum(PhysicType) })
    _physic_type_: PhysicType = PhysicType.POINTS;
    @property(
        {
            type: cc.Enum(PhysicType),
        }
    )
    get physic_type() { return this._physic_type_ }
    set physic_type(value: PhysicType) 
    {
        this._physic_type_ = value;
        this.__generate_physic();
    }
    
    @property()
    _sp_: cc.Vec2 = cc.v2(100, 0)
    @property()
    _mp_: cc.Vec2 = cc.v2(100, 0)
    @property()
    _ep_: cc.Vec2 = cc.v2(100, 0)

    @property( { displayName: "Start Point" } )
    get sp(): cc.Vec2 { return this._sp_ }
    set sp(value)
    {
        this._sp_ = value;
        this.draw();
    }

    @property( { displayName: "Start Point" } )
    get mp(): cc.Vec2 { return this._mp_ }
    set mp(value)
    {
        this._mp_ = value;
        this.draw();
    }

    @property( { displayName: "Start Point" } )
    get ep(): cc.Vec2 { return this._ep_ }
    set ep(value)
    {
        this._ep_ = value;
        this.draw();
    }

    protected __generate_physic(): void 
    {
        let ps: { points: cc.Vec2[] } = null;

        switch(this.physic_type)
        {
            case PhysicType.POINTS:
                ps = cc_support.component.get_component(this.node, cc.PhysicsChainCollider);
            break;
            case PhysicType.POLYGON:
                ps = cc_support.component.get_component(this.node, cc.PhysicsPolygonCollider);
            break;
        }
        ps.points = [];

        let arr = math.berize_curve(this, this.physic_jumper)
        for(const ret of arr) { ps.points.push(cc.v2(ret)) }
    }

    protected __destroy_physic(): void 
    {
        switch(this.physic_type)
        {
            case PhysicType.POINTS:
                this.node.removeComponent(cc.PhysicsChainCollider);
                break;
            case PhysicType.POLYGON:
                this.node.removeComponent(cc.PhysicsPolygonCollider);
                break;
        }
        this.node.removeComponent(cc.RigidBody)
    }

    protected __generate_collider(): void 
    {
        let ps = cc_support.component.get_component(this.node, cc.PolygonCollider);
        ps.points = []

        let arr = math.berize_curve(this, this.physic_jumper);
        for(const ret of arr) { ps.points.push(cc.v2(ret)) }
    }

    protected __destroy_collider(): void 
    {
        this.node.removeComponent(cc.PolygonCollider)
    }

    protected _draw_mechanic(): void 
    {
        const g = this.__graphic__;

        g.clear();
        g.moveTo(this.sp.x, this.sp.y);

        g.bezierCurveTo(this.sp.x, this.sp.y, this.mp.x, this.mp.y, this.ep.x, this.ep.y);


    }


}
