import {cc_support} from "../../CC_pTS/Support/CCSupporter";
import {IVec2} from "../../pTS/Math/IMath";
import {GPCircle} from "../Elements/GPCircle";
import {GPCore} from "./GPCore";

const {ccclass, property} = cc._decorator;

export enum PhysicType
{
    POINTS,
    POLYGON
}

@ccclass
export abstract class GPHelper extends GPCore 
{

    @property({type: cc.Integer, min: 1})
    physic_length: number = 10;

    @property({type: cc.Enum(PhysicType)})
    add_physic_type: PhysicType = PhysicType.POINTS;

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

    protected abstract __init_helper(): void;
    protected abstract __destroy_helper(): void;
    
    /**
     * @param {string} name Name of the node.
     * @param {cc.Color} color Color of the graphic.
     * @param {cc.Vec2} init_pos The world init position.
     *
     * @private
     */
    protected ___gpcircle_creator(name: string, color: cc.Color, init_pos: cc.Vec2)
    {
        let node = new cc.Node(name);
        const gp = node.addComponent(GPCircle);

        gp.graphic.fillColor = color;
        gp.rad = 16;

        this.node.addChild(node)
        node.setPosition(this.node.convertToNodeSpaceAR(init_pos));
        return gp;
    }

    protected ___gpcircle_destroyer(gp: GPCircle)
    {
        gp.node.destroy()
        gp.destroy();
        return null;
    }


    protected __generate_physic()
    {
        let ps: any;
        switch(this.add_physic_type)
        {
            case PhysicType.POINTS:
                ps = cc_support.component.get_component(this.node, cc.PhysicsChainCollider)
                break;
            case PhysicType.POLYGON:
                ps = cc_support.component.get_component(this.node, cc.PhysicsPolygonCollider)
                break;
        }
        ps.points = []
        let arr = this.__generate_array_point();

        for(const ret of arr)
        {
            ps.points.push(cc.v2(ret));
        }
    }


    protected __destroy_physic()
    {
        switch(this.add_physic_type)
        {
            case PhysicType.POINTS:
                this.node.removeComponent(cc.PhysicsChainCollider)
                break;
            case PhysicType.POLYGON:
                this.node.removeComponent(cc.PhysicsPolygonCollider)
                break;
        }
        this.node.removeComponent(cc.RigidBody)
    }

    protected __generate_collider(): void 
    {
        let ps = cc_support.component.get_component(this.node, cc.PolygonCollider);
        ps.points = [];

        let arr = this.__generate_array_point();

        for(const ret of arr)
        {
            ps.points.push(cc.v2(ret));
        }
    }

    protected __destroy_collider(): void 
    {
        this.node.removeComponent(cc.PolygonCollider);
    }

    protected abstract __generate_array_point(): IVec2[];
}
