import {CallbackManager} from "./CallbackManager";

export const global_callback =
{
    container: new Map<string, CallbackManager>(),

    add(cm: CallbackManager)
    {
        let uuid = cm.getUUID();

        if(this.container.has(uuid)) return false;
        this.container[uuid] = cm;
        return true;
    },

    register(id: string): CallbackManager
    {
        if(!this.container.has(id))
        {
            let ret = CallbackManager.createEmpty();
            this.container.set(id, ret);
            return ret;
        }
        return this.container.get(id);
    },

    remove(id: string): void
    {
        if(!this.container.has(id)) return;
        this.container.delete(id);
    },

    get(id: string, safe: boolean = true): CallbackManager
    {
        if(safe) return this.register(id);
        if(this.container.has(id))
        {
            return this.container.get(id);
        }
        return null;
    },

    reg(id: string, func: Function, binder = null, runTime = 0, order: number = 0)
    {
        let cb = global_callback.register(id);
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
