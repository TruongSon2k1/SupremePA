import {BaseMasterComponent} from "./BaseMasterComponent";

const {ccclass} = cc._decorator;

@ccclass
export abstract class ClickEventHelper extends BaseMasterComponent 
{
    protected onEnable() {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onMouseDown, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp.bind(this));
        this.node.on(cc.Node.EventType.TOUCH_END, this.onMouseUp.bind(this));
    }

    protected onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onMouseDown.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onMouseMove.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onMouseUp.bind(this));
        this.node.off(cc.Node.EventType.TOUCH_END, this.onMouseUp.bind(this));
    }

    abstract onMouseDown(event: any): void ;
    abstract onMouseMove(event: any): void ;
    abstract onMouseUp(event: any): void;
}
