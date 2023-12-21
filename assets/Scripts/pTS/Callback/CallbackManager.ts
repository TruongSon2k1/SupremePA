import {CallbackMaster} from "./CallbackMaster";
import {supporter} from "../Support/Support";

export class CallbackManager
{
/** CONST
 */

/** All Static function here
*/

    /**
     * @description
     * | A smart create function for this Callback Manager
     *
     * @param runTime Declare how many times you can invoke() this Manager.
     * @param callbacks Declare all your Callback Master here.
     *
     * @return A Callback Manager that created successfully by this method.
     *
     * @note To run Infinite time, you should pass 'a number < 0'.
     */
    static create(runTime: number, ...callbacks: CallbackMaster[])
    {
        let ret = new CallbackManager();
        return ret && ret.init(runTime, callbacks) ? ret : CallbackManager.createEmpty();
    }

    /**
     * @description
     * | Create an empty Callback Manager.
     *
     * @return A Callback Manager with the variable that all set to default.
     */
    static createEmpty()
    {
         let ret =  new CallbackManager();
         let dir = CallbackMaster.createEmpty();
         let args = [dir];
         return ret && ret.init(0, args) ? ret : null;
    }

/** Constructor
*/

    /**
     * @description
     * | The constructor of the Callback Manager.
     * 
     * @private
     *
     */
    private constructor()
    {

    }

/** 
 * # All Function here
*/

    /**
     * @description
     * | The initialization of the Callback Manager. This function will be called inside the static create() method. The creation of the Callback Manager only success if this initialization success. The result will be 'null' if this function fail.
     *
     * @param runTime The amount that this Callback Master can be called.
     * @param callbacks The array storage all the Callback Master variable.
     *
     * @return The success of this function.
     * 
     * @private
     */
    private init(runTime: number, callbacks: CallbackMaster[])
    {
        this._maxRunTime = runTime;
        this._uuid = supporter.GenerateUUID();
        return this.add(...callbacks);
    }

    /**
     * @description
     * | Fast Register a callback to this.
     *
     * @param callback The callback function that need to be registered.
     * @param binder The target binder of this function.
     * @param runTime The amount that this Callback Master be called.
     * @param order The order of the Callback Master that storage this callback function.
     *
     * @return The success of this function
     */
    public fastRegister(callback: Function, binder = null, runTime = 1, order: number = 0) {

        let ret = CallbackMaster.create(callback, binder, runTime, order);
        if (ret) {
            if (this.register(ret)) return true;
        }
        return false;
    }

    /**
     * @def Get the uuid of this CallbackManager, which assign as unique id, this will help searching for it.
     */
    public getUUID()
    {
        return this._uuid;
    }

    /**
     * @def Set the max amount that this Callback Manager can be called.
     *
     * @param runTime The amount to set this max value.
     */
    public setMaxRunTime(runTime: number)
    {
        this._maxRunTime = runTime;
    }

    /**
     * @def Add an array of Callback Master to this Callback Manager.
     *
     * @param callbacks the arrays of Callback Master.
     *
     * @return The success of this function.
     */
    public add(...callbacks: CallbackMaster[]) : boolean
    {
        if(callbacks.length <= 0) return false;
        for (const callback of callbacks)
        {
            if(!this.register(callback)) return false;
        }
        return true;
    }

    public quickAdd(...functions: Function[]) : boolean
    {
        supporter.BreakLog(functions.length > 0, "")
        for(const f of functions)
        {
            if(!this.quickReg(f)) return false;
        }
        return true;
    }

    public quickReg(func: Function, binder = null, runTime = 0, order: number = 0) : boolean
    {
        if(func)
        {
            let ret = CallbackMaster.create(func, binder, runTime, order);
            return !!this.register(ret);

        }
        return false;
    }

    /**
     * @def Invoke all the Callback Master in this Callback Manager.
     *
     * @param params The input params to invoke all the Callback Manager.
     */
    public invoke(...params: any[])
    {
        if(!this._active) return;

        for (const ret of this._callbacks)
        {
            ret.invoke(params);
        }

        this.doneInvoke();
    }


    /**
     * @private
     *
     * @def Resort all Callback Master in this Callback Manager.
     */
    private resort()
    {
        this._callbacks.sort( (l, r) => (r.getOrder() - l.getOrder()) )
    }

    /**
     * @private
     *
     * @def This function should be called after this Callback Manager invoke. This will recalculate the condition to check if this Callback Manager call be invoked next time.
     */
    private doneInvoke()
    {
        this._runTime ++;
        if(this._maxRunTime <= 0) return;
        if(this._runTime >= this._maxRunTime) this.inactive();
    }

    /**
     * @def Disable this Callback Manager, after this, nothing can invoke this Callback Manager.
     */
    public inactive()
    {
        this._active = false;
    }

    /**
     * @def Add a new Callback Master to this Callback Manager.
     *
     * @param callback The target Callback Master to register to this Callback Manager.
     */
    public register(callback: CallbackMaster)
    {
        if(!callback) return null;
        callback.setOwner(this);
        this._callbacks.push(callback);
        this.resort();
        return callback;
    }

    /**
     * @def Get the
     */
    public getCallbackNumber()
    {
        return this._callbacks.length;
    }

    private verifyCallback(callback: CallbackMaster): boolean
    {
        return true;
    }

/** All Variables here
*/


    protected _callbacks: CallbackMaster[] = [];

    protected _runTime: number = 0;                    //< Track how many times you invoke this Manager. This only work on RunTimer.CUSTOM Mode
    protected _maxRunTime: number = 1;                 //< Storage the number that define how many times you can invoke this Manager. This only work on RunTimer.CUSTOM Mode
    protected _active: boolean = true;

    protected _uuid: string = "";
}

//class UniqueArray<T>
//{
//    private _pool: T[];
//
//    public getPool()
//    {
//        return this._pool;
//    }
//
//    public push_back(ret: T)
//    {
//        ret = this.genUnique(ret);
//    }
//
//
//    private genUnique(ret: T)
//    {
//        let unq: any;
//        unq = ret;
//        do
//        {
//            switch (typeof unq)
//            {
//                case "number":
//                    unq = this.uniqueNumber(unq);
//                    break;
//                case "string":
//                    unq = this.uniqueString(unq);
//                    break;
//            }
//        }
//        while(this._pool.includes(unq));
//        return unq;
//    }
//
//    private uniqueNumber(ret: number)
//    {
//        return Math.floor((Math.random() * Math.random() / ret));
//    }
//
//    private uniqueString(ret: string)
//    {
//        return ret + this.uniqueNumber(Math.PI);
//    }
//}
