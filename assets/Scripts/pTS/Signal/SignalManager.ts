import {RuntimeClass} from "../Root/Class/RuntimeClass";
import {BaseSignal, IBaseSignal} from "./BaseSignal";

export class SignalManager extends RuntimeClass
{
    static create(max_run_time: number): SignalManager
    {
        let ret = new SignalManager();
        ret.max_run_time = max_run_time;
        return ret;
    }

    public push(option: IBaseSignal)
    {
        let ret = BaseSignal.create(option);
        this._signals_.push(ret);
        this.resort();
    }

    public add(...options: IBaseSignal[])
    {
        if(options.length <= 0) return; 

        for(const signal of options) this.push(signal)
    }

    protected resort()
    {
        this._signals_.sort( (l, r) => {return r.order - l.order;} )
    }

    protected mechanic(...params: any[]): void 
    {
        for(const ret of this._signals_) ret.execute(...params);
    }

    protected get extend_is_valid(): boolean 
    {
        return true;
    }

    protected _signals_: BaseSignal[] = []
}
