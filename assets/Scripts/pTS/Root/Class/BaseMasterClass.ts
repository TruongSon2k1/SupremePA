import {DefaultAssertOption, IAssertOption} from "../../Support/ISupport";
import {js} from "../../Support/JS";
import {IBaseMasterClass} from "../Interface/IBaseMasterClass";

export class BaseMasterClass implements IBaseMasterClass 
{
    _name_: string;

    log(...params: any[]): void 
    {
        console.log("[" + this._name_ + "] Log: ", params)
    }

    warn(...params: any[]): void 
    {
        console.warn("[" + this._name_ + "] Warn: ", params)
    }

    error(...params: any[]): void 
    {
        console.error("[" + this._name_ + "] Error: ", params)
    }

    assert(cond: boolean, option: IAssertOption = DefaultAssertOption): boolean
    {
        if(!cond)
        {
            switch(option.mode)
            {
                case "crash":
                    throw new Error(option.message);
                case "break":
                    console.warn(option.message);
                    debugger;
                    break; 
                case "warn":
                    console.warn(option.message);
                    break; 
            }

            return false;
        }
        return true;
    }

    constructor()
    {
        this.__pre_init();
        this._name_ = js.get_class_name(this);
        this.init();
    }

    protected __pre_init() {};
    protected init() {}

}
