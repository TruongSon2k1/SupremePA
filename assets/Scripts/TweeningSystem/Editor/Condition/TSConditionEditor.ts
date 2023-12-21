import {_TSQCond_} from "../../Core/Condition/TSACondition";
import {TSConditionANDManager, TSConditionORManager} from "../../Core/Condition/TSConditionManager";
import {ConditionType, ResetType, ViewMode} from "../../Helper/TSEnum";
import {TSAEditorObject} from "../Root/TSAEditorObject";
import {TSContentPreviewHelper} from "../Root/TSContentPreviewHelper";
import {TSConditionPreviewObject} from "./TSConditionPreviewObject";

const {ccclass, property} = cc._decorator;

@ccclass('TSConditionEditor')
export class TSConditionEditor extends TSAEditorObject 
{
    @property(
        {
            override: true,
            tooltip: "",
            type: [TSConditionPreviewObject],
            visible()
            {
                return this._view_mode_ === ViewMode.BOTH || this._view_mode_ === ViewMode.LISTS;
            }
        }
    )
    list: TSConditionPreviewObject[] = []

    u_auto_add(): void 
    {
        const adder = this._content_list_.find(ret => ret.is_add)
        if(adder) 
        {
            this.add_action(adder, this.list, (id: string) => { return TSConditionPreviewObject.create(id, this.list.length) })
        }
    }

    reload_content_list(): void 
    {
        const ret = _TSQCond_.creator.get;

        if(ret.size != this._content_list_.length && this._search_.length <= 0)
        {
            this._content_list_ = []
            ret.forEach((v) => 
            {
                this._content_list_.push(TSContentPreviewHelper.create(new v()))
            })
            return;
        }

        this._content_list_ = [];

        const ls = this._search_.toLowerCase();

        ret.forEach(( v, k ) => 
        {
            if(this._search_.length <= 0 || k.toLowerCase().includes(ls)) this._content_list_.push(TSContentPreviewHelper.create(new v()))
        })
    }

    protected generate_controller(): void 
    {
        this.view_mode = ViewMode.LISTS;
        
        const adders = this._content_list_.filter(ret => ret.add_me)

        adders.forEach( ret => { this.add_action(ret, this.list, (id: string) => { return TSConditionPreviewObject.create(id, this.list.length) }) } )
    }

    to_manager(  type: ConditionType, reset_type: ResetType = ResetType.THIS, silent: boolean)
    {
        switch(type)
        {
            case ConditionType.OR:
                return TSConditionORManager.create(reset_type, this.list, silent)
            case ConditionType.AND:
                return TSConditionANDManager.create(this.list, silent)
        }
    }
}
