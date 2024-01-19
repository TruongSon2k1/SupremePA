
const {ccclass, property, executeInEditMode, inspector} = cc._decorator;

@ccclass
@executeInEditMode
export class ENodeJS extends cc.Component
{
    @property(cc.Asset)
    jsr: cc.Asset = null

    protected onLoad(): void 
    {
    }

    protected start(): void {
        
    }
}
