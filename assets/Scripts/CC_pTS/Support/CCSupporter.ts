import {mark_singleton} from "../../pTS/Support/Decorators";
import {Instance} from "../../pTS/Support/Functions";
import {DefaultAssertOption, IAssertOption} from "../../pTS/Support/ISupport";
import {pTS} from "../../pTS/Support/pTSupport";
import {IJSonData} from "../Interface/IJSONData";

class CCConsole
{
    warn(...params: any[]): void 
    {
        if(CC_EDITOR) Editor.warn(...params, "");
        else console.warn(...params);
    }

    error(...params: any[]): void 
    {
        if(CC_EDITOR) Editor.error(...params, "");
        else console.error(...params);
    }

    log(...params: any[]): void
    {
        if(CC_EDITOR) Editor.log(...params, "");
        else console.log(...params);
    }

    assert(cond: boolean, option: IAssertOption = DefaultAssertOption)
    {
        if(!cond)
        {
            switch(option.mode)
            {
                case "crash":
                    if (!CC_EDITOR) throw new Error(option.message);
                    else Editor.error(option.message);
                case "break":
                    if(!CC_EDITOR) console.warn(option.message);
                    else Editor.warn(option.message);
                    debugger;
                    break; 
                case "warn":
                    if(!CC_EDITOR) console.warn(option.message);
                    else Editor.warn(option.message);
                    break; 
            }
        }
    }
}

class CCColor
{
    //parse_color(val: number): cc.Color
    //{
    //    const color = new cc.Color();
    //    //color.setR(val & 0x000000ff);
    //    //color.setG(val & 0x0000ff00 >> 8);
    //    //color.setB(val & 0x00ff0000 >> 16);
    //    //color.setA(val & 0xff000000 >>> 24);


    //    const r = (val | 0x000000ff);
    //    const g=(val & 0x0000ff00 >> 8);
    //    const b=(val & 0x00ff0000 >> 16);
    //    const a=(val & 0xff000000 >>> 24);
    //    Editor.log(r, g, b, a)
    //    return color;
    //}
    
}

class CCNode
{
    tree(root: cc.Node, tab: string = ">")
    {
        cc_support.console.log(tab, root.name);
        for(const ret of root.children) this.tree(ret, tab + ">");
    }
}

class CCTween
{
    /**
     * @description 
     * | Get the main target of the given tween.
     *
     * @param {cc.Tween<T>} tween The target tween to get the target from.
     *
     * @returns {T} The target of the tween.
     *
     * @deprecated Using `tween.getTarger()` directly to get the target of the tween if using pTSEngine.
     */
    get_target_from_tween<T>(tween: cc.Tween<T>): T
    {
        //@ts-ignore
        return tween.set()._target;
    }
}

class CCEditor
{
    /**
     * @description
     * | Refresh the editor's assets direction.
     * | This can talk a long time to refresh if the target direction is kinda big.
     * | 'db://xx/yy'
     *
     * @param {string} dir The assets direction.
     */
    refresh_editor(dir: string)
    {
        Editor.assetdb.refresh(dir);
    }
}

class CCComponent
{
    /**
     * @description
     * | Find the `FIRST` component matching with the given type in the given target node and all its child.
     * | Notice that this can take a long time if the given target is too big.
     *
     * @param {cc.Node | cc.Scene} scene The target node that need to be searched.
     * @param {ClassType<T> | string} type The component name.
     * 
     * @returns {T} The first component matching.
     */
    find_component<T extends cc.Component>(scene: cc.Node | cc.Scene, type: ClassType<T> | string): T
    {
        var comp = null;
        if(!(scene instanceof cc.Scene))
        {
            //@ts-ignore
            comp = scene.getComponent(type);
            if(comp) return comp;
        }

        for(const ret of scene.children)
        {
            comp = this.find_component(ret, type);
            if(comp) return comp;
        }
        return comp;
    }

    /**
     *
     *
     */
    count_component<T extends cc.Component>(scene: cc.Node | cc.Scene, type: ClassType<T> | string): number
    {
        var num: number = 0;
        if(!(scene instanceof cc.Scene))
        {
            //@ts-ignore
            num += scene.getComponents(type).length;
        }

        for(const ret of scene.children)
        {
            num += this.count_component(ret, type)
        }

        return num;
    }

    /**
     * @description
     * | Get the component of a node or component.
     * | If there is no matching component, automatically add one.
     *
     * @param {cc.Node | cc.Component} node The target to get the component from.
     * @param {ClassType<T> | string} type the Component name.
     *
     * @return {T} The looking for component.
     */
    get_component<T extends cc.Component>(node: cc.Node | cc.Component, type: ClassType<T> | string): T
    {
        //@ts-ignore
        var comp = node.getComponent(type);

        //@ts-ignore
        //
        if(!comp) comp = node.addComponent(type);
        return comp
    }

    find_root_node(node: cc.Node): cc.Node 
    {
        const papa = node.parent;
        if(papa) return this.find_root_node(papa);
        return node;
    }

    search_component<T>(target: cc.Node | cc.Component, instanceT: T): T & cc.Component
    {
        const node = target instanceof cc.Node ? target : target.node;

        //@ts-ignore
        const comps: cc.Component[] = node._components

        const instanceKey = Object.keys(instanceT);

        for(const ret of comps) {
            const keys = Object.keys(ret).concat(Object.keys(ret.constructor.prototype))

            //@ts-ignore
            if(pTS.utils.must_includes_array(instanceKey, keys)) return ret;
        }

        return null;
    }

    search_components<T>(target: cc.Node | cc.Component, instanceT: T): (T & cc.Component)[]
    {
        const arr: (T & cc.Component)[] = []
        const node = target instanceof cc.Node ? target : target.node;

        //@ts-ignore
        const comps: cc.Component[] = node._components

        const instanceKey = Object.keys(instanceT);

        for(const ret of comps) {
            const keys = Object.keys(ret).concat(Object.keys(ret.constructor.prototype))

            //@ts-ignore
            if(pTS.utils.must_includes_array(instanceKey, keys)) arr.push(ret);
        }

        //@ts-ignore
        return arr;
    }
}

class CCJSON
{
    stringify(object: object, replacer?: JSonReplacer)
    {
        const data: IJSonData =
        {
            type: cc.js.getClassName(object),
            data: object
        }

        return JSON.stringify(data, replacer)
    }

    /**
     * @description
     * | Save the raw string data to a raw path.
     * | Run only at edtior.
     *
     * @CC_EDITOR
     */
    save(data: string, path: string)
    {
        Editor.assetdb.createOrSave(path, data)
    }

    /**
     * @description
     * | The final path will be: `db://assets/ + path`
     * | Save data to a json path.
     * | Auto add '.json' for the path if missing is dected.
     *
     * @param {string | any}
     * @param {string} path The target path. Should not be a raw input.
     *
     */
    json_saver(data: object, path: string, replacer?: JSonReplacer )
    {
        let link = this.path(path);
        if (!path.includes('.json')) link += ".json"

        let js_data = "";

        js_data = this.stringify(data, replacer)

        this.save(js_data, link)
    }

    path(path: string)
    {
        return "db://assets/" + path;
    }

    raw_object(json: string, reviver?: JSonReviver): IJSonData
    {
        return JSON.parse(json, reviver) as IJSonData;
    }

    constructor_from_json<T>(json: string): ConstructClass<T>
    {
        const object = this.raw_object(json);

        //@ts-ignore
        return cc.js.getClassByName(object.type);
    }

    string_parser<T>(json: string, reviver?: JSonReviver): T
    {
        const object = this.raw_object(json, reviver);
        return this.parser(object, reviver);
    }

    uuid_parser(uuid: string, callback?: (data: IJSonData) => any): void 
    {
        cc.assetManager.loadAny([{uuid: uuid}], (err, asset) => {
            if (err) {
                cc_support.console.warn("Loading JSON Error: ", err)
                return null;
            }
            if (callback) callback(asset.json);
        })
    }


    parser<T>(object: IJSonData, reviver?: JSonReviver): T
    {
        //@ts-ignore
        const constructor = cc.js.getClassByName(object.type) as ConstructClass<T>;

        const data = new constructor();

        if(reviver)
        {
            for(const ret of Object.keys(object.data))
            {
                data[ret] = reviver(ret, object.data[ret])
            }
            return data;
        }

        if(data['from_json'])
        {
            data['from_json'](object.data);
            return data;
        }

        Object.assign(data, object.data);

        return data;
    }

}

@mark_singleton
class CCSupporter 
{
    tween: Readonly<CCTween> = new CCTween();
    editor: Readonly<CCEditor> = new CCEditor();
    component: Readonly<CCComponent> = new CCComponent();
    console: Readonly<CCConsole> = new CCConsole();
    node: Readonly<CCNode> = new CCNode();
    color: Readonly<CCColor> = new CCColor();
    json: Readonly<CCJSON> = new CCJSON();
}

export const cc_support = Instance(CCSupporter)


