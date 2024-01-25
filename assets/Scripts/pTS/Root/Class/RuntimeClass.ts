import {pTS} from "../../Support/pTSupport";
import {BaseMasterClass} from "./BaseMasterClass";


export abstract class RuntimeClass extends BaseMasterClass
{
    public execute(...params: any[]): void
    {
        if(!this.is_valid) return;
        this.mechanic(...params);
        this.done();
    }

    protected abstract mechanic(...params: any[]): void;

    protected done(): void
    {
        this._run_time_ ++;
        if(this._max_run_time_ <= 0) return;
        if(this._run_time_ >= this._max_run_time_) this.enable = false;
    }

    public get is_valid(): boolean
    {
        if(!this._active_) return false;
        return this.extend_is_valid;
    }

    protected abstract get extend_is_valid(): boolean;

    public get max_run_time(): number { return this._max_run_time_ }
    public get is_active(): boolean { return this._active_ }

    public set max_run_time(value: number) { this._max_run_time_ = pTS.numeric.to_int(value); }
    public set enable(value: boolean) { this._active_ = value; }

    protected _run_time_: number = 0;
    protected _max_run_time_: number = 0;
    protected _active_: boolean = true;
}
