const {ccclass, property} = cc._decorator;

@ccclass('TSAObjectPreviewHelper')
export abstract class TSAObjectPreviewHelper
{
    @property()
    action: any = null;

    @property()
    remove: boolean = false;

    @property( { visible() {return this.remove} } )
    remove_confirm: boolean = false;

    get is_remove() { return this.remove && this.remove_confirm }

    @property( { type: cc.Integer } )
    index: number = 0;

    destroy()
    {
        this.action.destroy()
    }
}
