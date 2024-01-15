import {IBaseMasterClass} from "../../pTS/Root/Interface/IBaseMasterClass";
import {DefaultAssertOption, IAssertOption} from "../../pTS/Support/ISupport";
import {js} from "../../pTS/Support/JS";
import {cc_support} from "../Support/CCSupporter";

const {ccclass} = cc._decorator;

@ccclass('BaseCCClass')
export abstract class BaseCCClass implements IBaseMasterClass
{

    _name_: string;

    log(...params: any[]): void 
    {
        cc_support.console.log("[" + this._name_ + "] Log: ", params);
    }

    warn(...params: any[]): void 
    {
        cc_support.console.warn("[" + this._name_ + "] Warn: ", params);
    }

    error(...params: any[]): void 
    {
        cc_support.console.error("[" + this._name_ + "] Error: ", params);
    }

    assert(cond: boolean, option: IAssertOption = DefaultAssertOption)
    {
        cc_support.console.assert(cond, option);
    }

    constructor()
    {
        this._name_ = js.get_class_name(this);
    }
}
