import {BaseMasterClass} from "../../pTS/Root/Class/BaseMasterClass";

const {ccclass} = cc._decorator;

@ccclass('SchedulableObject')
export class SchedulableObject extends BaseMasterClass
{
    private _enabled_: boolean = false;
    private _self_enable()
    {
        if(this._enabled_) return;
        cc.director.getScheduler().enableForTarget(this);
        this._enabled_ = true;
    }

    /**
     * @description
     * | Create a new scheduler for this callback from the `cc.director._scheduler`
     * | The callback will be called every `interval` seconds for `repeat` times after delaying `delay` seconds.
     *
     */
    schedule(callback: Function, interval: number, repeat: number, delay: number, pause: boolean)
    {
        this._self_enable();
        cc.director.getScheduler().schedule(callback, this, interval, repeat - 1, delay, pause);
    }

    schedule_once(callback: Function, delay: number = 0, pause: boolean = false)
    {
        this.schedule(callback, 0, 1, delay, pause);
    }

    schedule_infinite(callback: Function, interval: number = 0, delay: number = 0, pause: boolean = false)
    {
        this.schedule(callback, interval, cc.macro.REPEAT_FOREVER, delay, pause);
    }
}
