import {IJSonData} from "../Interface/IJSONData";
import {cc_support} from "../Support/CCSupporter";
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
        this._infor_.sync(this.node, true)
    }

    @property()
    set to_json(path: string)
    {
        cc_support.json.json_saver(this._infor_, path, this._infor_.json_replacer);       
    }


    @property(cc.JsonAsset)
    json: cc.JsonAsset = null;

    @property()
    set from_json(value: boolean)
    {

        Editor.log("ASKLJFLASK", this.json)
        if(!this.json) return;
        const constructor =  cc.js.getClassByName(this.json.json.type)
        if(value) this._infor_ = cc_support.json.parser(this.json.json, constructor['json_reviver']);
    }

    @property()
    set uuid2json(uuid: string)
    {
        cc_support.json.uuid_parser(uuid, (data: IJSonData) => {
            const constructor = cc.js.getClassByName(data.type)

            if (data && constructor) {
                this._infor_ = cc_support.json.parser(data, constructor['json_reviver'])
            }
        });
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
