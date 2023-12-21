import {_TSQMecha_} from "../../Core/Mechanic/TSAMechanic";
import TSMechanicManager from "../../Core/Mechanic/TSMechanicManager";
import {ViewMode} from "../../Helper/TSEnum";
import {TSAEditorObject} from "../Root/TSAEditorObject";
import {TSContentPreviewHelper} from "../Root/TSContentPreviewHelper";
import {TSMechanicPreviewObject} from "./TSMechanicPreviewObject";

const {ccclass, property} = cc._decorator;

@ccclass('TSMechanicEditor')
export class TSMechanicEditor extends TSAEditorObject 
{
    @property(
        {
            override: true,
            type: [TSMechanicPreviewObject],
            visible()
            {
                return this.view_mode === ViewMode.BOTH || this.view_mode === ViewMode.LISTS;
            }
        }
    )
    list: TSMechanicPreviewObject[] = []

    @property()
    get total_time_cost()
    {
        return this.list.reduce((total, ret) => total + ret.action.duration, 0)
    }

    u_auto_add(): void 
    {
        const adder = this._content_list_.find(ret => ret.is_add)
        if(adder)
        {
            this.add_action(adder, this.list, (id: string) => { return TSMechanicPreviewObject.create(id, this.list.length) })
        }
    }


    protected generate_controller(): void 
    {
        this.view_mode = ViewMode.LISTS;
        
        const adders = this._content_list_.filter(ret => ret.add_me)

        adders.forEach( ret => { this.add_action(ret, this.list, (id: string) => { return TSMechanicPreviewObject.create(id, this.list.length) }) } )
    }

    reload_content_list(): void 
    {
        const ret = _TSQMecha_.creator.get;

        this._content_list_ = [];

        const ls = this._search_.toLowerCase();
        
        ret.forEach(( v, k ) => 
        {
            if(this._search_.length <= 0 || k.toLowerCase().includes(ls)) this._content_list_.push(TSContentPreviewHelper.create(new v()))
        })
    }

    to_manager()
    {
        return TSMechanicManager.create(this.list)
    }
}
