const {ccclass, property, inspector, executeInEditMode, menu, help} = cc._decorator;

@ccclass
@executeInEditMode
@menu("i18n:MAIN_MENU.component.ui/pTSButton")
@help("i18n:COMPONENT.help_url.button")
@inspector("packages://pts-button/inspector/pts_button.js")
export default class CustomButton extends cc.Button {
    @property({
        type: cc.AudioClip,
        displayName: "Audio",
        tooltip: CC_DEV && "按钮触发时播放的音频剪辑",
    })
    private audioClip: cc.AudioClip = null;

    @property(cc.Vec2)
    private childOffest: cc.Vec2 = cc.v2(0, 0);

    private btnPressed: boolean = false;

    private btnRect: cc.Rect = null;

    protected onEnable() 
    {
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        super.onEnable();
        if (this.btnPressed) {
        this.subOffset();
        }
        this.btnPressed = false;
    }

    protected onDisable() {
        this.node.off(cc.Node.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.off(cc.Node.EventType.TOUCH_END, this.onTouchEnd, this);
        super.onDisable();
    }

    private onTouchStart(event: cc.Event.EventTouch) {
        if (!this.interactable || !this.enabledInHierarchy) { return; }
        this.btnPressed = true;
        this.addOffset();
    }

    private onTouchCancel(event: cc.Event.EventTouch) {
        if (!this.interactable || !this.enabledInHierarchy) { return; }
        if (this.btnPressed) {
            this.subOffset();
        }
        this.btnPressed = false;
    }

    private onTouchMove(event: cc.Event.EventTouch) {
        if (!this.interactable || !this.enabledInHierarchy) { return; }
        this.btnRect = this.node.getBoundingBox();
        let pressed = true;
        const nodeVec = this.node.parent.convertToNodeSpaceAR(event.getLocation());
        if (!this.btnRect.contains(nodeVec)) {
            pressed = false;
        }
        if (this.btnPressed && !pressed) {
            this.subOffset();
        }
        if (!this.btnPressed && pressed) {
            this.addOffset();
        }
        this.btnPressed = pressed;
    }

    private onTouchEnd(event: cc.Event.EventTouch) {
        if (!this.interactable || !this.enabledInHierarchy) { return; }
        if (this.btnPressed) 
        {
            this.subOffset();
        }
        this.btnPressed = false;
    }

    private addOffset() {
        if (this.transition !== cc.Button.Transition.SPRITE) {
            return;
        }
        if (this.childOffest.equals(cc.Vec2.ZERO)) {
            return;
        }
        for (const child of this.node.children) {
            child.position = child.position.add(this.childOffest);
        }
    }

    private subOffset() {
        if (this.transition !== cc.Button.Transition.SPRITE) {
            return;
        }
        if (this.childOffest.equals(cc.Vec2.ZERO)) {
            return;
        }
        for (const child of this.node.children) {
            child.position = child.position.sub(this.childOffest);
        }
    }
}
