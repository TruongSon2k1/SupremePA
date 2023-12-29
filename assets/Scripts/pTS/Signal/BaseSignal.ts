import {RuntimeClass} from "../Root/Class/RuntimeClass";
import {SignalManager} from "./SignalManager";

export interface IBaseSignal
{
    callback: Function;
    binder: any;
    max_run_time: number;
    order: number;
}

export class BaseSignal extends RuntimeClass implements IBaseSignal
{


    static create(option: IBaseSignal): BaseSignal
    {
        let ret = new BaseSignal();
        ret.settup(option);
        return ret;
    }

    private settup(option: IBaseSignal)
    {
        this._callback_ = option.callback;
        this._binder_ = option.binder;
        this.max_run_time = option.max_run_time;
        this.order = option.order;
    }

    protected mechanic(...params: any[]): void 
    {
        this._callback_.apply(this._binder_, params);
    }

    protected get extend_is_valid(): boolean { return !!this._callback_; }

    public get order(): number { return this._order_ }
    public get owner() { return this._owner_ }

    public set order(value: number) { this._order_ = value; }

    public get binder(): any { return this._binder_ }
    public get callback(): Function { return this._callback_}

    protected _callback_: Function = null;
    protected _owner_: SignalManager = null
    protected _binder_: any = null;
    protected _order_: number = 0;
}
