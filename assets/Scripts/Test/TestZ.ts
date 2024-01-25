
const {ccclass, property} = cc._decorator;

@ccclass
export class TestZ extends cc.Component 
{
    protected onLoad(): void {
        console.log(pTS.support.common.is_boolean)
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.on_key_down, this)
    }
    on_key_down(event: any)
    {
        switch(event.keyCode)
        {
            case cc.macro.KEY.a:
            break;

        }
    }


}
