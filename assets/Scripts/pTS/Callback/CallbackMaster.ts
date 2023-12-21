import {CallbackManager} from "./CallbackManager";
import ccclass = cc._decorator.ccclass;
import property = cc._decorator.property;

@ccclass('CallbackMaster')
export class CallbackMaster
{

///////] All Static Functions here

    public static create(callback: Function, binder = null, runTime = 0, order: number = 0)
    {
        let ret = new CallbackMaster();
        if(ret && ret.init(callback, runTime, binder, order))
        {
            return ret;
        }
        return CallbackMaster.createEmpty();
    }

    /**
     * @def Create an empty Callback Master.
     *
     * @return The Callback Master that its variable has default value.
     */
    public static createEmpty()
    {
        let ret = new CallbackMaster();
        return ret && ret.init(null, 0, null, 0) ? ret : null;
    }

///////] Constructor
    private constructor()
    {

    }


///////] All Function here

    public getOwner()
    {
        return this._owner;
    }

    public ownerAddCallback(...callbacks: CallbackMaster[])
    {
        this._owner.add(...callbacks);
    }
    public setOwner(owner: CallbackManager)
    {
        if(owner) this._owner = owner;
        else
        {
            throw new Error("The Owner of " + this + " can not be null.")
        }
    }
    public invoke(params?: any[])
    {
        if(!this._active || !this._callback) return;
        this._callback.apply(this._binder, params);
        this.doneInvoke();
    }

    public execute(...params: any[])
    {
        this.invoke(params);
    }

    private doneInvoke()
    {
        this._runTime ++;
        if(this._maxRunTime <= 0) return;
        if(this._runTime >= this._maxRunTime) this.inactive();
    }
    public getCallback()
    {
        return this._callback;
    }

    public inactive()
    {
        this._active = false;
    }

    private init(callback: Function, runTime: number, binder, order: number)
    {
        this._callback = callback;
        this._binder = binder;
        this.setOrder(order);
        this.setMaxRunTime(runTime);
        return true;
    }

    public setMaxRunTime(runTime: number)
    {
        this._maxRunTime = runTime;
    }

    public setOrder(order: number)
    {
        this._order = order;
    }

    public getOrder()
    {
        return this._order;
    }

///////] All Variable here

    protected _callback: Function = null;
    protected _owner = null;
    protected _order = 0;
    protected _active = true;
    protected _runTime = 0;
    protected _maxRunTime = 1;
    protected _binder = null;
}
