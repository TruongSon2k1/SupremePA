import {CallbackMaster} from "./CallbackMaster";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CallbackCollider extends cc.Component
{
    public setCallbackMaster(enter: CallbackMaster = null, exit: CallbackMaster = null)
    {
        this.setCollider(enter, exit);
    }

    public setCallback(enter: Function = null, exit: Function = null)
    {
        let en = CallbackMaster.create(enter, null, 0, 0);
        let ex = CallbackMaster.create(exit, null, 0, 0);

        this.setCollider(en, ex);
    }

    private setCollider(enter: CallbackMaster, exit: CallbackMaster)
    {
        this._onEnterCollide = enter;
        this._onExitCollide = enter;
    }

    onCollisionEnter(other, self)
    {
        if(this._onEnterCollide)
        {
            this._onEnterCollide.execute(other, self);
        }
    }

    onCollisionExit(other, self)
    {
        if(this._onEnterCollide)
        {
            this._onEnterCollide.execute(other, self);
        }
    }

    private _onEnterCollide: CallbackMaster = null;
    private _onExitCollide: CallbackMaster = null;
}