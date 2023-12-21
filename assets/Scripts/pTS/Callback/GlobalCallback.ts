import {CallbackMaster} from "./CallbackMaster";
import {CallbackManager} from "./CallbackManager";
import {supporter} from "../Support/Support";

export const global_callback =
{
    container: new Map<string, CallbackMaster>(),

    log: "[GlobalCallback] Log: ",

    quickLog(...params: any[])
    {
        //return this.log + message;
        supporter.log(this.log, params);
    },

    invokeWinFullPack(params?: any[])
    {
        this.preWin.invoke(params);
        this.win.invoke(params);
        this.postWin.invoke(params);
    },

    invokeLoseFullPack(params?: any[])
    {
        this.preLose.invoke(params);
        this.lose.invoke(params);
        this.postLose.invoke(params);
    },

    add(cm: CallbackManager)
    {
        supporter.Assert(!!cm, this.quickLog("Callback Manager must be non-nil!"));
        let uuid = cm.getUUID();

        if(this.container.has(uuid))
        {
            supporter.Assert(false, this.quickLog("This CallbackManager already added. It cant be added again"));

            return false;
        }
        this.container[uuid] = cm;
        return true;
    },

    register(id: string)
    {
        if(!this.container.has(id))
        {
            let ret = CallbackManager.createEmpty();
            this.container.set(id, ret);
            return ret;
        }
        return this.container.get(id);
    },


    getCallBack(id: string)
    {
        if(this.container.has(id))
        {
            return this.container.get(id);
        }
        return null;
    },

    quickRegAtId(id: string, func: Function, binder = null, runTime = 0, order: number = 0)
    {
        let cb = this.getCallBack(id);
        if(cb)
        {
            cb.quickReg(func, binder, runTime, order);
            return true;
        }
        return false;
    },

    qR(id: string, cbm: {func: Function, binder: any, run_time: 0, order: 0})
    {
        let cb = this.getCallBack(id);
        if(cb)
        {
            cb.quickReg(cbm.func, cbm.binder, cbm.run_time, cbm.order)
            return true;
        }
        return false;
    },
    quickInvokeAtId(id: string)
    {
        let cb = this.getCallBack(id);
        if(cb)
        {
            cb.invoke();
            return true;
        }
        return false;
    },

    win: CallbackManager.create(1, CallbackMaster.createEmpty()),

    lose: CallbackManager.create(1, CallbackMaster.createEmpty()),

    preSolve: CallbackManager.createEmpty(),

    custom: CallbackManager.createEmpty(),
}

//export class GlobalCallback
//{
//    public enableSuperMode()
//    {
//        this._super = true;
//    }
//
//    public disableSuperMode()
//    {
//        this._super = false;
//    }
//
//    private static _instance: GlobalCallback = null;
//    public static getInstance()
//    {
//        if(!GlobalCallback._instance)
//        {
//            GlobalCallback._instance = new GlobalCallback();
//            GlobalCallback._instance.init();
//        }
//        return GlobalCallback._instance;
//    }
//
//    public register(id: string, callback: CallbackManager, group: number = 0)
//    {
//        id = id.toLowerCase();
//        if(this._callbacks.has(id))
//        {
//            return false;
//        }
//        this._callbacks.set("id", CallbackManagerExtend.create(group, callback));
//        return true;
//    }
//
//    public delete(id: string)
//    {
//        if(this._callbacks.has(id))
//        {
//            this._callbacks.delete(id);
//            return;
//        }
//    }
//
//    private init()
//    {
//        if(!this.register("Pre-Win", CallbackManager.createEmpty(), this._superGroup)) return false;
//        if(!this.register("Win", CallbackManager.createEmpty(), this._superGroup)) return false;
//        if(!this.register("Post-Win", CallbackManager.createEmpty(), this._superGroup)) return false;
//
//        if(!this.register("Pre-Lose", CallbackManager.createEmpty(), this._superGroup)) return false;
//        if(!this.register("Lose", CallbackManager.createEmpty(), this._superGroup)) return false;
//        if(!this.register("Post-Lose", CallbackManager.createEmpty(), this._superGroup)) return false;
//    }
//
//    private constructor()
//    {
//
//    }
//
//    public log()
//    {
//
//    }
//
//    public getCallbackById(id: string)
//    {
//        id = id.toLowerCase();
//        if(this._callbacks.has(id))
//        {
//            return;
//        }
//        return this._callbacks.get(id).callback;
//    }
//
//    /**
//     * @def Get the Win Callback Manager.
//     *
//     * @return The Win Callback Manager.
//     */
//    public getWin()
//    {
//        return this.getCallbackById("Win");
//    }
//
//    /**
//     * @def Get the Pre-Win Callback Manager.
//     *
//     * @return The Pre-Win Callback Manager.
//     */
//    public getPreWin()
//    {
//        return this.getCallbackById("Pre-Win");
//    }
//
//    /**
//     * @def Get the Post-Win Callback Manager.
//     *
//     * @return The Post-Win Callback Manager.
//     */
//    public getPostWin()
//    {
//        return this.getCallbackById("Post-Win");
//    }
//
//    /**
//     * @def Get the Win Callback Manager.
//     *
//     * @return The Win Callback Manager.
//     */
//    public getLose()
//    {
//        return this.getCallbackById("Lose");
//    }
//
//    /**
//     * @def Get the Pre-Win Callback Manager.
//     *
//     * @return The Pre-Win Callback Manager.
//     */
//    public getPreLose()
//    {
//        return this.getCallbackById("Pre-Lose");
//    }
//
//    /**
//     * @def Get the Post-Win Callback Manager.
//     *
//     * @return The Post-Win Callback Manager.
//     */
//    public getPostLose()
//    {
//        return this.getCallbackById("Post-Lose");
//    }
//
//    /**
//     * @def Invoke all Win callback.
//     * @tree The Life cycle callback: Pre-Main -> Main -> Post-Main
//     */
//    public invokeWin()
//    {
//
//    }
//
//    /**
//     * @def Invoke all Win callback.
//     * @tree The Life cycle callback: Pre-Main -> Main -> Post-Main
//     */
//    public invokeLose()
//    {
//
//    }
//
///** All Variables here.
//  */
//
//    private _callbacks: Map<string, CallbackManagerExtend> = null;
//    private _super: boolean = false;
//    private _superGroup: number = 314;
//
//}

//class CallbackManagerExtend
//{
//    public callback: CallbackManager = null;
//    public group: number = 0;
//
//    private init(group: number, callback: CallbackManager)
//    {
//        this.group = group;
//        this.callback = callback;
//        return true;
//    }
//
//    private constructor()
//    {
//    }
//
//    public static create(group: number, callback: CallbackManager)
//    {
//        let ret = new CallbackManagerExtend();
//        return ret && ret.init(group, callback) ? ret : null;
//    }
//}