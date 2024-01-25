"use strict"

function RGBAToHexA(r,g,b,a) 
{
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);
  a = Math.round(a * 255).toString(16);

  if (r.length == 1) r = "0" + r;
  if (g.length == 1) g = "0" + g;
  if (b.length == 1) b = "0" + b;
  if (a.length == 1) a = "0" + a;

  return "#" + r + g + b + a;
}

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

    if(node.is3DNode) return create_node3d_infor(node, ret);
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

function rgba2hex(orig) 
{
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
            .text {
            background: #ffffff; 
            margin-right: auto;
            }

        `,

        template: `
            <div style="margin-bottom: 50px;"></div>
            <div class="layout horizontal center">
                <div class="flex-1"></div>
                <ui-node class="flex-2" style="width: 300px;height: 50px;" id="node_data" type="cc.Node" typename="Node" droppable='node'></ui-node>
                <div class="flex-1"></div>
            </div>

            <cc-object-prop :this.sync="this.data"></cc-object-prop>

            <ui-section>
                <div slot="header">Infor</div>
                <ui-prop id="is3d" name="Is3d" value="false" type="boolean" indent="1" readonly></ui-prop>
                <ui-prop id="position" name="Position" type="vec2" value="[0, 0]" readonly></ui-prop>
                <ui-prop id="rotation" name="Rotation" type="number" value="0" readonly></ui-prop>
                <ui-prop id="scale" name="Scale" type="vec2" value="[1, 1]" readonly></ui-prop>
                <ui-prop id="size" name="Size" type="vec2" value="[0, 0]" readonly></ui-prop>
                <ui-prop id="color" name="Color" type="color" value="#ffffff" readonly></ui-prop>
                <ui-prop id="opacity" name="Opacity" type="number" value="255" readonly></ui-prop>
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
            rotation: '#rotation',
            scale: "#scale",
            size: "#size",
            color: '#color',
            opacity: "#opacity",
            
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

            this.$size.$propX.setAttribute("name", "W"),
            this.$size.$propY.setAttribute("name", "H"),
            this.$json_sync_button.addEventListener('confirm', () => 
            {
                if(!this.$node_data._value) return;
                const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
                this.node_infor = create_infor(node);

            });

            this.$json_data_holder.addEventListener('change', () => 
            {

            })

            this.$node_data.addEventListener('change', () => 
            {
                const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
                this.node_infor = create_infor(node);

                this.sync_html_element(this.node_infor);

            })
        },

        sync_html_element(infor)
        {
            const opt = {};
            //| Size Attribute
                const sz = infor.size;
                this.$size.valueChanged(opt, [sz.width, sz.height]);

            //| Color Attribute
                const cl = infor.color;                                                 //< Shorter instance.
                this.$color.valueChanged(opt, [cl.r, cl.g ,cl.b, cl.a/255]);             //< cl.a/255 cause it range is 0->1, Maybe because the `$alpha` is progress tag.

            //| Opacity Attribute
                this.$opacity.valueChanged(opt, infor.opacity)

            if(infor.is3d) this.sync_3d_infor(infor);
            else this.sync_2d_infor(infor);
        },

        sync_2d_infor(infor)
        {
            const opt = {};

            //| Is 3d Attribute
                this.$is3d.valueChanged(opt, infor.is3d);
            //| Position Attribute
                this.$position.setAttribute("type", "vec2");                            //< Cast the attribute type to be Vec2. Needed if its current type is Vec3.
                //this.$position.$inputX.$input.value = infor.position.x                //< Old way to set X.
                //this.$position.$inputY.$input.value = infor.position.y                //< Old way to set Y.
                const pos = infor.position;                                             //< Shorter instance.
                this.$position.valueChanged(opt, [pos.x, pos.y]);                        //< Model way to set value.

            //| Rotation Attribute
                this.$rotation.setAttribute("type", "number");                          //< Cast the attribute type to be Number. Needed if its current type is Vec3.
                this.$rotation.valueChanged(opt, infor.rotation);                        //<<
            
            //| Scale Attribute
                this.$scale.setAttribute("type", "vec2");
                const scl = infor.scale;
                this.$scale.valueChanged(opt, [scl.x, scl.y]);
        },

        sync_3d_infor(infor)
        {
            const opt = {};

            //| Is 3d Attribute
                this.$is3d.valueChanged(opt, infor.is3d);
            //| Position Attribute
                this.$position.setAttribute("type", "vec3");                            //< Cast the attribute type to be Vec2. Needed if its current type is Vec3.
                //this.$position.$inputX.$input.value = infor.position.x                //< Old way to set X.
                //this.$position.$inputY.$input.value = infor.position.y                //< Old way to set Y.
                const pos = infor.position;                                             //< Shorter instance.
                this.$position.valueChanged(opt, [pos.x, pos.y, pos.z]);                        //< Model way to set value.

            //| Rotation Attribute
                this.$rotation.setAttribute("type", "vec3");                          //< Cast the attribute type to be Number. Needed if its current type is Vec3.
                const rot = infor.rotation;
                this.$rotation.valueChanged(opt, [rot.x, rot.y, rot.z]);                        //<<
            
            //| Scale Attribute
                this.$scale.setAttribute("type", "vec3");
                const scl = infor.scale;
                this.$scale.valueChanged(opt, [scl.x, scl.y, scl.z]);
        },

        no_color(html)
        {
            html.setAttribute('class', "fixed-label flex-1")
        },

        messages: {
            'node-data:open'(event) {
            }
        }

    }
)
