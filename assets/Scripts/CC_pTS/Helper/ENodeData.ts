import {Node2DInformation, Node3DInformation} from "./NodeInformation";

const {ccclass, executeInEditMode, property, inspector}= cc._decorator;

@ccclass
@executeInEditMode
@inspector('packages://node-data/inspector/node_data.js')
export class ENodeData extends cc.Component 
{
    @property(Node2DInformation)
    _infor_: Node2DInformation = null;

    @property(
        {
            tooltip: "Saved node data."
        }
    )
    get infor()
    {
        this.__on_change_node_type()
        return this._infor_;
    }

    @property()
    set save_data(value: boolean)
    {
        if(value) this.__setup_data();
    }

    @property()
    set sync_data(value: boolean)
    {
        if(value) this.__sync_data();
    }


    __on_change_node_type()
    {

        if(this.node.is3DNode && !this._infor_.is3d) this._infor_ = Node3DInformation.create(this.node)
        else if(!this.node.is3DNode && this._infor_.is3d) this._infor_ = Node2DInformation.create(this.node)
    }

    __setup_data()
    {
        if (this.node.is3DNode) this._infor_ = Node3DInformation.create(this.node)
        else this._infor_ = Node2DInformation.create(this.node);
    }

    __sync_data()
    {
        this._infor_.sync(this.node)
    }

    protected onLoad(): void 
    {
        if(CC_EDITOR)
        {
            this.__setup_data();
        }
        else 
        {
            this.destroy();
        }
    }

}
