import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {ViewMode} from "../../Helper/TSEnum";
import {TSAObjectPreviewHelper} from "./TSAObjectPreviewHelper";
import {TSContentPreviewHelper} from "./TSContentPreviewHelper";


const {ccclass, property} = cc._decorator;

@ccclass('TSAEditorObject')
export abstract class TSAEditorObject extends BaseMasterClass
{
    @property({type: cc.Enum(ViewMode)})
    _view_mode_: ViewMode = ViewMode.NONE;
    @property({type: cc.Enum(ViewMode)})
    get view_mode(): ViewMode { return this._view_mode_; }
    set view_mode(value: ViewMode) 
    {
        this._view_mode_ = value;
        switch(value)
        {
            case ViewMode.CONTENTS:
                this.reload_content_list();
                break
            case ViewMode.BOTH:
                this.reload_content_list();
                break
        }
    }

    abstract reload_content_list(): void

    @property()
    _search_: string = ""
    @property(
        {
            visible()
            {
                return this._view_mode_ === ViewMode.BOTH || this._view_mode_ === ViewMode.CONTENTS
            }
        }
    )
    get search() { return this._search_ }
    set search(value: string)
    {
        this._search_ = value;
        if(!value)
        {
            this._view_mode_ = ViewMode.NONE;
            setTimeout(() => {this.view_mode = ViewMode.CONTENTS}, 300)
            return;
        }
        this.reload_content_list()
        
    }

    @property([TSContentPreviewHelper])
    _content_list_: TSContentPreviewHelper[] = [];
    @property(
        {
            tooltip: "The contents list of this object.",
            type: [TSContentPreviewHelper],
            visible() { return this.view_mode === ViewMode.CONTENTS || this.view_mode === ViewMode.BOTH}
        }
    )
    get content_list(): TSContentPreviewHelper[] { return this._content_list_ }

    @property(
        {
            visible()
            {
                if(this.view_mode === ViewMode.NONE) return false;
                if(this._content_list_.length <= 0) return false;
                
                return this._content_list_.some((ret: TSContentPreviewHelper) => ret.add_me)
            }
        }
    )
    get generate() { return false }
    set generate(value: boolean) { if(value) this.generate_controller(); }

    protected abstract generate_controller(): void

    @property([TSAObjectPreviewHelper])
    list: TSAObjectPreviewHelper[] = [];
    
    @property(
        {
            visible()
            {
                if(this._view_mode_ === ViewMode.NONE || this.list.length <= 0) return false;
                return this.list.some( (ret: TSAObjectPreviewHelper) => ret.remove )
            }
        }
    )
    get acept_remove() { return false; }
    set acept_remove(value: boolean)
    {
        if(value) this.remove_action(this.list);
    }

    public updater(): void
    {
        this.u_auto_add();
        this.u_auto_remove(this.list);
        this.u_auto_sort();
        this.u_contents_update();
    }

    abstract u_auto_add(): void;

    u_contents_update()
    {
        for(const ret of this.list) {ret.action.e_updater()}
    }

    u_auto_sort()
    {
        this.list.sort( (a: TSAObjectPreviewHelper, b: TSAObjectPreviewHelper) => a.index - b.index );
    }

    remove_action(target: TSAObjectPreviewHelper[])
    {
        const arr = target.filter( ret => { return !ret.remove })
        if(arr.length != target.length)
        {
            target.length = 0;
            target.push(...arr)
        }
    }

    u_auto_remove(target: TSAObjectPreviewHelper[])
    {
        const arr = target.filter(ret => { return !ret.is_remove })
        if(arr.length != target.length)
        {
            target.length = 0;
            target.push(...arr)
        }
    }

    add_action<T extends TSAObjectPreviewHelper>(helper: TSContentPreviewHelper, preview_targets: T[], call_back: (id: string) => T )
    {
        helper.reset();
        preview_targets.push(call_back(helper.name));
    }

    chain_add_actions<T extends TSAObjectPreviewHelper>(helper: TSContentPreviewHelper[], preview_targets: T[], call_back: (id: string) => T )
    {
        helper.filter(ret => ret.add_me && ret.add_confirm)
              .forEach(ret => this.add_action(ret, preview_targets, call_back))
    }

    /**
     * @description
     * | Only called at Editor mode.
     */
    destroy() 
    {
        for(const ret of this.list) ret.destroy();
    }
}
