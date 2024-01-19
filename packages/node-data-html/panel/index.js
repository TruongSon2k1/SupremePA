"use strict"

function create_infor(node)
{
    const ret = {
        position: {},
        is3d: false,
        rotation: {},
        scale: {},
        size: node.getContentSize(),
        opacity: node.opacity,
        color: {
            g: node.color.g,
            r: node.color.r,
            b: node.color.b,
            a: node.color.a,
        }
    }

    if(node.is3d) return create_node3d_infor(node, ret);
    return create_node2d_infor(node, ret);
}

function create_node2d_infor(node, ret)
{
    ret.position = cc.v2(node.position);
    ret.is3d = false;
    ret.rotation = node.angle;
    ret.scale = cc.v2(node.scaleX, node.scaleY);

    return ret;
}

function create_node3d_infor(node, ret)
{
    ret.position = node.position;
    ret.is3d = true;
    ret.rotation = node.eulerAngles;
    ret.scale = cc.v3(node.scaleX, node.scaleY, node.scaleZ);

    return ret;
}

Editor.Panel.extend(
    {
        node_infor: {
            position: cc.v2(0,0),
            is3d: false,
            rotation: 0,
            scale: cc.v2(0,0),
            size: cc.size(0, 0),
            opacity: 255,
            color: {
                g: 255,
                r: 255,
                b: 255,
                a: 255,
            }
        },
        style: `
            :host { margin: 5px; }
            h2 { color: #f90; }
        `,

        template: `
            <div style="margin-bottom: 50px;"></div>
            <div class="layout horizontal center">
                <div class="flex-1"></div>
                <ui-node class="flex-2" style="width: 300px;height: 50px;" id="node_data" type="cc.Node" typename="Node" droppable='node'></ui-node>
                <div class="flex-1"></div>
            </div>

            <ui-section>
                <ui-prop id="is3d" name="Is3d" value="false" type="boolean" readonly indent="1"></ui-prop>
                <ui-prop id="position" name="Position" type="vec2" value="[0, 0]"readonly></ui-prop>
            </ui-section>

            <div style="margin-bottom: 20px;"></div>
            <div class="layout horizontal center">
                <ui-button style="margin-bottom:20px;position:relative;top:10px;" class="red small flex-1" id="json_sync_button" >Save Data</ui-button>
                <ui-asset class="flex-1" style="with:100px;" type="cc.Asset" droppable="asset" id="json_data_holder"></ui-asset>
                <ui-input class="flex-2" style="width:200px;" placeholder="db://assets/..." @change="input_url" v-value="data_url"></ui-input>
                <ui-button style="margin-bottom:20px;position:relative;top:10px;width:100px" class="blue small flex-1" @confirm="to_json" >To JSon</ui-button>
            </div>
        `,

        $: {
            is3d: '#is3d',
            position: '#position',
            
            node_data: '#node_data',
            json_data_holder: '#json_data_holder',

            sync_data_url: '#sync_data_url',
            json_sync_button: "#json_sync_button",
            local_sync_button: '#local_sync_button',

            save_data_url: '#save_data_url',
            json_save_button: "#json_save_button",
            local_save_button: "#local_save_button"
        },

        ready() {
            this.$json_sync_button.addEventListener('confirm', () => {
                Editor.Ipc.sendToMain('node-data:sync_with_json')
                Editor.log(Editor.url('editor-framework://static/window.html'))

            });

            this.$json_data_holder.addEventListener('change', () => {
            })

            this.$node_data.addEventListener('change', () => {
                const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
                this.node_infor = create_infor(node);
                this.$position._value = [this.node_infor.position.x, this.node_infor.position.y]
                Editor.Panel.newFrame('node-data', () =>
                    {
                        Editor.log(this.$position._value, "")
                    })
            })
        },

        messages: {
            'node-data:open'(event) {
            }
        }
    }
)
