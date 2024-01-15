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

    @property({ readonly: true })
    get opacity() { return this.color.a }
    set opacity(value: number) { this.color.a = value }
    
    static create(node: cc.Node)
    {
        const ret = new Node2DInformation()
        ret.position = cc.v2(node.position);
        ret.color = node.color;
        ret.rotation = node.angle;
        ret.scale = cc.v2(node.scaleX, node.scaleY)
        ret.size = node.getContentSize();
        ret.is3d = false;

        return ret;
    }

    sync(node: cc.Node)
    {
        node.position = cc.v3(this.position);
        node.angle = this.rotation;
        node.setContentSize(this.size);
        node.scaleX = this.scale.x;
        node.scaleY = this.scale.y
        node.color = this.color;
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

    static create(node: cc.Node)
    {
        const ret = new Node3DInformation()
        ret.position = node.position;
        ret.color = node.color;
        ret.rotation = node.eulerAngles;
        ret.scale = cc.v3(node.scaleX, node.scaleY, node.scaleZ)
        ret.size = node.getContentSize();
        ret.is3d = true;

        return ret;
    }

    sync(node: cc.Node)
    {
        node.position = this.position;
        node.eulerAngles = this.rotation;
        node.setContentSize(this.size);

        node.scaleX = this.scale.x
        node.scaleY = this.scale.y
        node.scaleZ = this.scale.z

        node.color = this.color;
    }
}
