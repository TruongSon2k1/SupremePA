
const {ccclass, property, requireComponent, executeInEditMode, playOnFocus, inspector} = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
@executeInEditMode
@playOnFocus
@inspector('packages://test-button/inspector/test.js')
export class TestButtonPackage extends cc.Component 
{
    @property()
    target: cc.Vec2 = cc.v2()

    _is_acting_: boolean = false;

    @property()
    get but() { return false; }
    set but(value: boolean) { if(value) this.action() }

    func: Function;

    action()
    {
        if(this._is_acting_ && this.func) { this.func(); return; }
        const temp = this.node.position;
        this.func = () => {if(this._is_acting_) { this.node.setPosition(temp); this._is_acting_ = false; return; } }
        this._is_acting_ = true;
        cc.tween(this.node).to(1, {position: cc.v3(this.target)}).start()
    }

    protected onLoad(): void 
    {
    }
}
