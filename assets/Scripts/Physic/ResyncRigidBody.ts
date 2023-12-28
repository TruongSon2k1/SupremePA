const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    _rb_: cc.RigidBody;
    protected onLoad(): void {
        this._rb_ = this.getComponent(cc.RigidBody);
        cc.view.setResizeCallback(() => { this._rb_.syncPosition(false) })
    }

    protected update(dt: number): void {
        this._rb_.syncPosition(false)
    }
}

console.log(cc.RigidBody.prototype)

