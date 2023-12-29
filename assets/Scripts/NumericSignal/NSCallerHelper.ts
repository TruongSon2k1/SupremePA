import {GS} from "../pTS/Signal/GlobalSignal";
import {sup} from "../pTS/Support/Supporter";
import {NSPooling} from "./NSPooling";

const {ccclass, property} = cc._decorator;

@ccclass('NSPasserHelper')
export class NSPasserHelper
{
    passer: { passed: boolean }[] = [{passed: false}];

    private _index_: number = 0;

    get passed_time(): number
    {
        return this._index_ - 1;
    }

    get is_ever_pass(): boolean
    {
        if(this._index_ > 0) return true;
        return this.passer[0].passed;
    }

    //get is_current_term_pass(): boolean
    //{
    //    return this.passer[this._index_].passed;
    //}

    pass()
    {
        this.passer[this._index_].passed = true;
        this.passer.push({passed: false})
        this._index_ ++;
    }
}

@ccclass('NSCallerHelper')
export class NSCallerHelper 
{
    @property(
        {
            type: cc.Integer,
            min: 1,
            tooltip: ""
        }
    )
    target_amount: number = 1;

    @property()
    _id_: string = sup['string'].uuid('NS', 'CH');
    @property()
    set id(value: string)
    {
    }

    @property()
    get refresh() { return false; }
    set refresh(value: boolean) 
    {
        if(value) this._auto_id();
    }

    _auto_id()
    {
        this.id = sup['string'].uuid('NS', 'CH');
    }

    @property(
        {
            tooltip: "Regist this 'NSCallerHelper', "
        }
    )
    register_to_pool: boolean = true;

    _called_num_: number = 0;
    _is_passed_: boolean = false;

    public get is_ready() { return this._is_passed_ }

    constructor()
    {
        
    }

    init(func: Function, binder = null)
    {
        GS.signal.fast({id: this.id, safe: true}, {callback: func, binder: binder, max_run_time: 0, order: 0})

        if(this.register_to_pool) NSPooling.instance().register(this);
    }

    call(amount: number = 1): void
    {
        if(this._is_passed_) return;
        this._called_num_ += amount;
        if(this._called_num_ >= this.target_amount)
        {
            this._is_passed_ = true;
        }
    }

    reset()
    {
        this._called_num_ = 0;
        this._is_passed_ = false;
    }

    recirculate_reset()
    {
        this._called_num_ -= this.target_amount
        this._is_passed_ = false;
    }

    get percent() { return this._called_num_ / this.target_amount }

    get percent_once()
    {
        if(this._is_passed_) return 1;
        return this.percent;
    }
}
