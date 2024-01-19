import {cc_support} from "../Support/CCSupporter";

const {ccclass, property} = cc._decorator;

export interface INodeInformation
{
    position: cc.Vec2 | cc.Vec3;
    rotation: number | cc.Vec3;
    scale: cc.Vec2 | cc.Vec3;
    size: cc.Size;
    color: cc.Color;
    opacity: number;
    is3d: boolean;
}

@ccclass('Node2DInformation')
export class Node2DInformation implements INodeInformation
{
    @property({ readonly: true })
    is3d: boolean;
    @property({ readonly: true , type: cc.Vec2})
    position: any = cc.v2()

    @property({ readonly: true })
    rotation: any = 0;

    @property({ readonly: true, type: cc.Vec2 })
    scale: any = cc.v2()

    @property({ readonly: true })
    size: cc.Size = cc.size(0, 0)

    @property({ readonly: true, type: cc.Color })
    color: cc.Color = cc.Color.WHITE

    @property({ readonly: true, visible: false })
    _opacity_: number = 255;
    @property()
    get opacity() { this.color.a = this._opacity_; return this._opacity_ }
    
    static create(node: cc.Node | INodeInformation)
    {
        const ret = new Node2DInformation()

        ret.set(node);
        return ret;
    }

    json_replacer: JSonReplacer = (key: string, value: any) => 
    {
        if(key === 'color')
        {
            return { r: value.r, g: value.g, b: value.b, a: value.a  }
        }
        return value;
    }

    static json_reviver: JSonReviver = (key: string, value: any) =>
    {
        if(key === 'position') return cc.v2(value.x, value.y);
        if(key === 'scale') return cc.v2(value.x, value.y)
        if(key === 'color') return cc.color(value.r, value.g, value.b)
        if(key === 'size') return cc.size(value.width, value.height);

        return value;
    }

    set(node: cc.Node | INodeInformation)
    {
        this.position = cc.v2(node.position);
        this.is3d = false;

        this._opacity_ = node.opacity;
        if(node instanceof cc.Node)
        {
            this.rotation = node.angle;
            this.scale = cc.v2(node.scaleX, node.scaleY)
            this.size = node.getContentSize();
            this.color = node.color;
            this.color.a = this._opacity_;
            return;
        }

        this.rotation = node.rotation;
        this.scale = cc.v2(node.scale.x, node.scale.y);
        //@ts-ignore
        const nc = node.color;
        this.color = new cc.Color(nc.r, nc.g, nc.b);
        Editor.log(this.color)
        this.color.a = this._opacity_;
        this.size = cc.size(node.size.width, node.size.height);
    }

    from_json(object: any)
    {
        this.set(object as INodeInformation);
    }

    sync(node: cc.Node, force: boolean = false)
    {
        if (force) {
            if(this.is3d != node.is3DNode){
                node.is3DNode = false
                this.is3d = false
            }
        }
        node.position = cc.v3(this.position);
        node.angle = this.rotation;
        node.setContentSize(this.size);
        node.scaleX = this.scale.x;
        node.scaleY = this.scale.y
        node.color = this.color;
        node.opacity = this._opacity_;
    }

}

@ccclass('Node3DInformation')
export class Node3DInformation extends Node2DInformation
{
    @property({ readonly: true, override: true, type: cc.Vec3 })
    position: cc.Vec3 = cc.v3();

    @property({ readonly: true, override: true, type: cc.Vec3 })
    rotation: cc.Vec3 = cc.v3();

    @property({ readonly: true, override: true, type: cc.Vec3 })
    scale: cc.Vec3 = cc.v3()

    static create(node: cc.Node | INodeInformation)
    {
        const ret = new Node3DInformation()
        ret.set(node);

        return ret;
    }

    set(node: cc.Node | INodeInformation)
    {

        this.position = cc.v3(node.position);
        this.is3d = true;
        this._opacity_ = node.opacity;

        if(node instanceof cc.Node)
        {
            this.rotation = node.eulerAngles;
            this.scale = cc.v3(node.scaleX, node.scaleY)
            this.size = node.getContentSize();
            this.color = node.color;
            this.color.a = this._opacity_;
            return;
        }

        this.rotation = cc.v3(node.rotation);

        //@ts-ignore
        this.scale = cc.v3(node.scale.x, node.scale.y, node.scale.z);

        //@ts-ignore
        this.color = cc.color(nc.r, nc.g, nc.b);
        this.color.a = this._opacity_;
        this.size = cc.size(node.size.width, node.size.height);
    }

    static json_reviver: JSonReviver = (key: string, value: any) =>
    {
        if(key === 'position') return cc.v3(value.x, value.y, value.z);
        if(key === 'scale') return cc.v3(value.x, value.y, value.z)
        if(key === 'color') return cc.color(value.r, value.g, value.b)
        if(key === 'size') return cc.size(value.width, value.height);
        if(key === 'rotation') return cc.v3(value.x, value.y, value.z)

        return value;
    }

    sync(node: cc.Node, force: boolean = false)
    {
        if(force){
            if(this.is3d != node.is3DNode){
                this.is3d = true
                node.is3DNode = true
            }
        }

        node.position = this.position;
        node.eulerAngles = this.rotation;
        node.setContentSize(this.size);

        node.scaleX = this.scale.x
        node.scaleY = this.scale.y
        node.scaleZ = this.scale.z

        node.color = this.color;

    }
}
