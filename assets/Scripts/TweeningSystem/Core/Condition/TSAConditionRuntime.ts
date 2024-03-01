import {JSonObject} from "../../../CC_pTS/JSon/JSonObject";

const {ccclass, property} = cc._decorator;

@ccclass('TSAConditionRuntime')
export abstract class TSAConditionRuntime extends JSonObject
{
    _is_passed_: boolean = false;

    abstract check_runtime(): boolean;
    abstract after_passing(): void;

    public get is_passed(): boolean
    {
        if(this._is_passed_ && this.check_runtime()) 
        {
            this.after_passing()
            return true;
        }
        return false;
    }

    public reset()
    {
        this._is_passed_ = false;
    }
}

@ccclass('TSACNormalRuntime')
export class TSACNormalRuntime extends TSAConditionRuntime
{
    @property(
        {
            tooltip: "The amount of times that this condition can be passed to execute these mechanics. \n`0` mean forever.",
            min: 0,
            type: cc.Integer
        }
    )
    max_run_time: number = 1;

    _passed_time_: number = 0;

    check_runtime(): boolean 
    {
        if(this.max_run_time <= 0) return true;
        return this._passed_time_ < this.max_run_time;
    }

    after_passing(): void 
    {
        this._passed_time_ ++;
    }

    public static create()
    {
        let ret = new TSACNormalRuntime()
        return ret;
    }

    protected __to_json?: () => string = () =>
    {
        return `{
            "max_run_time": ${this.max_run_time}
        }`
    }
}
