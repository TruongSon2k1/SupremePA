import {mark_singleton} from "../../pTS/Support/Decorators";
import {Instance} from "../../pTS/Support/Functions";
import {DefaultAssertOption, IAssertOption} from "../../pTS/Support/ISupport";

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
}

@mark_singleton
class CCSupporter 
{
    tween: Readonly<CCTween> = new CCTween();
    editor: Readonly<CCEditor> = new CCEditor();
    component: Readonly<CCComponent> = new CCComponent();
    console: Readonly<CCConsole> = new CCConsole();
    node: Readonly<CCNode> = new CCNode();
}

export const cc_support = Instance(CCSupporter)


