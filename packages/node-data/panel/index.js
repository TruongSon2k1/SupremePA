"use strict"

const NODE_3D_TYPE = 'Node3DInformation'
const NODE_2D_TYPE = 'Node2DInformation'
const JSON_TYPE = '.json'

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

function infor_json_paser(key, value)
{
    if(key === 'color')
    {
        return { r: value.r, g: value.g, b: value.b, a: value.a  }
    }
    return value;
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

/**
 * @param {string} data 
 * @param {string} path 
 * @param {(key, value) => any} paser 
 *
 */
function save_json(data, path, paser)
{
    let json = JSON.stringify(data, paser)
    Editor.assetdb.createOrSave(path, json)
    Editor.log(`Success saving data to ${path}`)
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

/**
 * @param {cc.Node} node
 * @param {object} infor
 * @returns {boolean}
 */
function sync_node_data(node, infor)
{
    if(!is_valid(node)) {
        Editor.error("The target Node can not be null!!")
        return false;
    }

    node.position = cc.v3(infor.position)
    node.scale = infor.scale;
    node.is3D = infor.is3d;
    node.opacity = (infor.opacity)
    node.setContentSize(infor.size);

    node.color = cc.color(infor.color.r, infor.color.g, infor.color.b);
    node.color.a = infor.opacity;

    if(infor.is3d) {
        node.eulerAngles = infor.rotation;
    }
    else {
        node.angle = infor.rotation; 
    }

    return true;
}

function is_valid(object)
{
    return object != null && object != undefined;
}

const default_infor = {
            position: cc.v2(0,0),
            is3d: false,
            rotation: 0,
            scale: cc.v2(1,1),
            size: cc.size(0, 0),
            opacity: 255,
            color: {
                g: 255,
                r: 255,
                b: 255,
                a: 255,
            }
}

Editor.Panel.extend(
    {
        /**
         * 
         */
        node_infor: default_infor,
        ref_node: null,
        style: `
            :host { margin: 5px; }
            .text {
            background: #ffffff; 
            margin-right: auto;
            }

        `,
        save_url: "",
        json_save_url: "",

        template: `
            <div style="margin-bottom: 15px;"></div>

            <div class="layout horizontal center">
                <div class="flex-1"></div>
                <ui-node class="flex-2" style="width:300px;height:50px;" id="node_target" type="cc.Node" typename="Node" droppable='node' name='Target'></ui-node>
                <div class="flex-1"></div>
            </div>

            <ui-section style="margin-top: -30px">
                <div slot="header" >Infor</div>
                <ui-prop id="is3d" name="Is 3d" value="false" type="boolean" indent="1" readonly></ui-prop>
                <ui-prop id="position" name="Position" type="vec2" value="[0, 0]" readonly></ui-prop>
                <ui-prop id="rotation" name="Rotation" type="number" value="0" readonly></ui-prop>
                <ui-prop id="scale" name="Scale" type="vec2" value="[1, 1]" readonly></ui-prop>
                <ui-prop id="size" name="Size" type="vec2" value="[0, 0]" readonly></ui-prop>
                <ui-prop id="color" name="Color" type="color" value="#ffffff" readonly></ui-prop>
                <ui-prop id="opacity" name="Opacity" type="number" value="255" readonly></ui-prop>
                <ui-button class="red tiny" id="reset" >Reset</ui-button>
            </ui-section>

            <hr></hr>

            <div style="margin-bottom: 20px;"></div>
            <div class="layout horizontal center">
                <ui-node class="flex-3" style="width:300px;" id="node_data" type="cc.Node" typename="Node" droppable='node' name='target'></ui-node>
                <div class="flex-1"></div>
                <ui-asset class="flex-3" style="with:100px;" type="cc.JsonAsset" droppable="asset" id="json_data_holder"></ui-asset>
                <ui-button style="margin-bottom:20px;position:relative;top:10px;width:200px;" class="red small flex-2" id="save_data" >Save Data</ui-button>
            </div>

            <div style="margin-bottom: 5px;"></div>
            <div class="layout horizontal center">
                <ui-asset class="flex-2" style="with:100px;" type="cc.JsonAsset" droppable="asset" id="json_data_file"></ui-asset>
                <ui-input class="flex-3" style="width:200px;" placeholder="db://assets/..." id="json_data_input"></ui-input>
                <ui-button style="margin-bottom:20px;position:relative;top:10px;width:200px;" class="blue small flex-2" id="to_json" >To JSon</ui-button>
            </div>
        `,

            /**
             *
             *                         ______________________________________
             *                         |NODE[TARGET]                        |
             *                         |------------------------------------|
             *                         |INFOR                               |   
             *                         |  Is3d                              |   
             *                         |  Position                          |   
             *                         |  Rotation                          |   
             *                         |  Scale                             |   
             *                         |  Size                              |   
             *                         |  Color                             |   
             *                         |  Opacity                           |   
             *                         |------------------------------------|
             *  GET INFOR DATA />      |NODE       JSON-ASSET      SAVE_DATA|     </ SAVE CURRENT INFOR TO TARGET NODE
             *                         |                                    |   
             *  GET TARGET DIR />      |JSON-ASSET       INPUT     TO_JSON  |     </ SAVE CURRENT INFOR TO JSON FILE
             *                         |____________________________________|
             */

        $: {

            
            is3d:                       '#is3d',
            position:                   '#position',
            rotation:                   '#rotation',
            scale:                      "#scale",
            size:                       "#size",
            color:                      '#color',
            opacity:                    "#opacity",
            
            node_target:                "#node_target",                 
                                                                        
            node_data:                  '#node_data',                   
            json_data_holder:           '#json_data_holder',
            save_data:                  "#save_data",

            to_json:                    "#to_json",
            json_data_file:             "#json_data_file",
            json_data_input:            '#json_data_input',

            reset:                      '#reset'
        },

        ready() {

            this.$size.$propX.setAttribute("name", "W");
            this.$size.$propY.setAttribute("name", "H");
                
////////////////////////////////////////////////////////////////////////////////
                
            /**
             * @description
             * | Get the node data after dragging it on.
             *
             */
            this.$node_target.addEventListener('change', () => 
            {
                    if(!this.$node_target._value) { this.ref_node = null; return; }

                this.ref_node = cc.engine.getInstanceById(this.$node_target._value);
            });


////////////////////////////////////////////////////////////////////////////////
                
            /**
             * @description
             * | Save data button
             *
             */
            this.$save_data.addEventListener('confirm', () => 
            {
                sync_node_data(this.ref_node, this.node_infor)
            });

            /**
             * @description
             * | Get the Infor data after dragging `JSON` file on.
             */
            this.$json_data_holder.addEventListener('change', () => 
            {
                cc.assetManager.loadAny([{uuid: this.$json_data_holder._value}], (err, asset) => {
                    if (err) {
                        Editor.log("Loading JSON Error: ", err)
                        return null;
                    }
                    this.node_infor = asset.json.data;

                    this.sync_html_element(this.node_infor);
                })
            });

            /**
             * @description
             * | Get the Infor data after dragging `Node` on.
             *
             */
            this.$node_data.addEventListener('change', () => 
            {
                if(!this.$node_data._value) return;

                const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
                this.node_infor = create_infor(node);

                this.sync_html_element(this.node_infor);

            });

////////////////////////////////////////////////////////////////////////////////
            
            this.$json_data_input.addEventListener('confirm', () => 
            {

                this.json_save_url = this.quick_db_url(this.$json_data_input._value)
            })

            this.$json_data_file.addEventListener('change', () =>
            {
                this.save_url = Editor.remote.assetdb.uuidToUrl(this.$json_data_file._value);

            })

            this.$to_json.addEventListener('confirm', () => 
            {
                this.to_json_helper(this.save_url);
                this.to_json_helper(this.json_save_url);
            })

////////////////////////////////////////////////////////////////////////////////
    
            this.$reset.addEventListener('confirm', () =>
            {
                this.sync_html_element(default_infor)
            })

        },

        to_json_helper(url)
        {
            const L = JSON_TYPE.length;
            if(url.length < 0) return;
            if(url.length <= L && url.indexOf(JSON_TYPE) < 0) return;

            if (url.indexOf(JSON_TYPE) < 0) url += JSON_TYPE;

            if(this.node_infor.is3d) var type = NODE_3D_TYPE
            else type = NODE_2D_TYPE;

            const data = {
                type: type,
                data: this.node_infor
            }

            save_json(data, url, infor_json_paser)
        },

        quick_db_url(url)
        {
            if(url.indexOf(`db://assets/`) < 0)
            {
                url = 'db://assets/' + url;
            }
            return url;
        },

        quick_url(url)
        {
            url = this.quick_db_url(url)

            return Editor.url(url);
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
                this.$position.valueChanged(opt, [pos.x, pos.y, pos.z]);                //< Model way to set value.

            //| Rotation Attribute
                this.$rotation.setAttribute("type", "vec3");                            //< Cast the attribute type to be Number. Needed if its current type is Vec3.
                const rot = infor.rotation;                                             
                this.$rotation.valueChanged(opt, [rot.x, rot.y, rot.z]);                //<<
            
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

