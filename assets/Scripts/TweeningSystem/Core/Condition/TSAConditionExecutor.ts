import {GameMaster} from "../../../Manager/GameMaster";

const {ccclass, property} = cc._decorator;

@ccclass('TSAConditionExecutor')
export abstract class TSAConditionExecutor
{
    public abstract ready(): boolean;
}

@ccclass('TSANormalConditionExecutor')
export class TSANormalConditionExecutor extends TSAConditionExecutor
{
    public ready(): boolean
    {
        return true;
    }

    public static create(): TSANormalConditionExecutor
    {
        let ret = new TSANormalConditionExecutor();
        return ret;
    }
}

@ccclass('TSAOverloadingExecutor')
export class TSAOverloadingExecutor extends TSAConditionExecutor
{
    public static create(): TSANormalConditionExecutor
    {
        let ret = new TSAOverloadingExecutor();
        return ret;
    }

    @property(
        {
            tooltip: `Describe how much time to await after executing the pass action. 
                \nOnly valid at [OVERLOAD] mode.`,
            min: 0
        }
    )
    await_clock: number = 0;
    
    _ready_up_: boolean = true;

    public ready(): boolean 
    {
        if(this._ready_up_)
        {
            this._ready_up_ = false;
            GameMaster.instance.scheduleOnce(() => { this._ready_up_ = true }, this.await_clock);
            return true;
        }
        return false;
    }
}
