import {BaseMasterClass} from "../Root/Class/BaseMasterClass";
import {mark_singleton} from "../Support/Decorators";
import {BaseMasterFactory} from "./BaseMasterFactory";

export class FactoryManager extends BaseMasterClass
{
    public register<T>(id: string)
    {
        if(this.assert(!this._creator_.has(id), 
                       {
                           mode: 'warn',
                           message: `The class named with id: ${id} is already registered inside the creator.`
                       }))
        {
            this._creator_.set(id, new BaseMasterFactory<T>);
        }
    }

    public get<T>(id: string, safe: boolean = true): BaseMasterFactory<T>
    {
        let it = this._creator_.get(id);

        if(!it)
        {
            this.warn(`There is no 'BaseMasterFactory' registered with id: ${id} inside the creator.`);
            if(safe)
            {
                this.register<T>(id);
                return this.get<T>(id, true);
            }
            return null;
        }
        return it;
    }
    
    protected init(): void 
    {
        this._creator_ = new Map<string, BaseMasterFactory<any>>();    
    }

    public get creator() { return this._creator_ }

    private _creator_: Map<string, BaseMasterFactory<any>>;

    private static _instance_: FactoryManager = null;
    public static instance()
    {
        if(!FactoryManager._instance_) FactoryManager._instance_ = new FactoryManager();
        return FactoryManager._instance_;
    }
}

