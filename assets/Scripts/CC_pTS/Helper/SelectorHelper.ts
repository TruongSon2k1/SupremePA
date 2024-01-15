import {BaseCCClass} from "../ExpertComponent/BaseCCClass";

const {ccclass, property} = cc._decorator;

@ccclass('TheSelectorHelper')
export class TheSelectorHelper
{
    @property(cc.Component)
    _target_: cc.Component = null;
    @property(
        {
            type: cc.Component,
            readonly: true,
        }
    )
    get target(): cc.Component { return this._target_ }

    @property()
    get uuid(): string { return this._target_.uuid }

    @property()
    selecting: boolean = false;

    static create(target: cc.Component)
    {
        const ret = new TheSelectorHelper();
        ret._target_ = target;
        return ret;
    }
}

@ccclass('SelectorHelper')
export abstract class SelectorHelper<T extends cc.Component> extends BaseCCClass
{
    @property(cc.Node)
    _target_: cc.Node = null;

    @property(
        {
            type: cc.Node
        }
    )
    set target(value: cc.Node)
    {
        if(value === this._target_) return;

        this._target_ = value;
        this.reset();
    }
    get target(): cc.Node 
    {
        if(this._target_)
        {
            this.__generate_list();
            if(this._list_.length > 1)
            {

            }
        }
        return this._target_ 
    }

    __generate_list(): void
    {
        const list = this.__get_comps_list();
        if(this._list_.length != list.length) this._list_ = [];
        else return;
        for(const ret of list)
        {
            this._list_.push(TheSelectorHelper.create(ret));
        }
    }

    protected abstract __get_comps_list(): T[]
    
    @property([TheSelectorHelper])
    _list_: TheSelectorHelper[] = []

    @property(
        {
            type: [TheSelectorHelper],
            visible(){ return this._list_.length > 0 }
        }
    )
    get list(): TheSelectorHelper[] { return this._list_ }

    reset()
    {
        this._list_ = [];
    }

    get selecting_list()
    {
        return this._list_.filter( v => v.selecting ).map( v => v._target_ );
    }
}
