import {CallbackManager} from "./CallbackManager";

export const global_callback =
{
    container: new Map<string, CallbackManager>(),

    add(cm: CallbackManager)
    {
        let uuid = cm.getUUID();

        if(global_callback.container.has(uuid)) return false;
        global_callback.container[uuid] = cm;
        return true;
    },

    register(id: string): CallbackManager
    {
        if(!global_callback.container.has(id))
        {
            let ret = CallbackManager.createEmpty();
            global_callback.container.set(id, ret);
            return ret;
        }
        return global_callback.container.get(id);
    },


    get(id: string): CallbackManager
    {
        if(global_callback.container.has(id))
        {
            return global_callback.container.get(id);
        }
        return null;
    },

    reg(id: string, func: Function, binder = null, runTime = 0, order: number = 0)
    {
        let cb = global_callback.get(id);
        if(cb)
        {
            cb.quickReg(func, binder, runTime, order);
            return true;
        }
        return false;
    },

    invoke_at(id: string)
    {
        let cb = global_callback.get(id);
        if(cb)
        {
            cb.invoke();
            return true;
        }
        return false;
    },
}
