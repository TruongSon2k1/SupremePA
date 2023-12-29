import {FactoryManager} from "../Factory/FactoryManager";
import {BaseMasterClass} from "../Root/Class/BaseMasterClass";
import {Instance} from "../Support/Functions";
import {IBaseSignal} from "./BaseSignal";
import {SignalManager} from "./SignalManager";

export interface IGlobalSignalOption
{
    id: string;
    safe: boolean;
}

class GlobalSignal extends BaseMasterClass
{
    public register(id: string, max_run_time: number = 0): SignalManager
    {
        if(!this[this.qid(id)])
        {
            this[this.qid(id)] = SignalManager.create(max_run_time);
            this[id] = function () { return this[this.qid(id)] }
        }

        return this[this.qid(id)]
    }

    public fast(option: IGlobalSignalOption, ...signals: IBaseSignal[])
    {
        var sm = this.get(option);
        if(!sm) 
            {
                if(option.safe)
                {
                    sm = this.register(option.id);
            }
            else 
                {
                    this.warn(`There is no signal registered with id: ${option.id}`);
                return;
            }

        }
        sm.add(...signals);
    }

    public get(option: IGlobalSignalOption): SignalManager 
    {
        if(option.safe) return this.register(option.id);
        else return this[option.id]();
    }
        
    private qid(id: string): string { return `__${id}__` }
}

Instance(FactoryManager).register<string>('__GlobalSignal__');

export const GS = 
{
    signal: new GlobalSignal(),
    pool: Instance(FactoryManager).get<string>("__GlobalSignal__"),
    ids: {

        register: function(id: string)
        {
            GS.pool.register(id, id)
        },

        remove: function(id: string)
        {
            GS.pool.remove(id);
        },
        get: Instance(FactoryManager).get<string>("__GlobalSignal__").array()
    }
}

