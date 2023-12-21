import {BaseMasterClass} from "../pTS/Root/Class/BaseMasterClass";
import {NSCallerHelper} from "./NSCallerHelper";

const {ccclass} = cc._decorator;

@ccclass('NSPooling')
export class NSPooling extends BaseMasterClass
{
    private static _instance_: NSPooling = null;
    
    public static instance(): NSPooling
    {
        if(!NSPooling._instance_)
        {
            let ret = new NSPooling();
            ret.ctor();
            nsp = NSPooling._instance_ = ret;
        }
        return NSPooling._instance_;
    }

    protected init() {}

    protected ctor() {}

    private _pool_: Map<string, NSCallerHelper> = new Map<string, NSCallerHelper>();

    public register(target: NSCallerHelper | { id: string; target: NSCallerHelper }): NSCallerHelper 
    {
        const id = target.id;
        const ret = target instanceof NSCallerHelper ? target : target.target;
    
        if(!this._pool_.has(id)) this._pool_.set(id, ret);
        else this.warn(`The 'NSCallerHelper' with the id: ${id} has been registered.`);

        return this._pool_.get(id);
    }

    public get(id: string): NSCallerHelper
    {
        return this._pool_.has(id) ? this._pool_.get(id) : null
    }

    reset_all()
    {
        this._pool_.forEach((v) => v.reset());
    }
}

export let nsp: Readonly<NSPooling> = null;
