import {BaseMasterClass} from "../../pTS/Root/Class/BaseMasterClass";

const {ccclass, property} = cc._decorator;

@ccclass('TSRObject')
export abstract class TSRObject extends BaseMasterClass
{
    abstract _description_: string;

    @property(
        {
            tooltip: "The name of the object."
        }
    )
    get name() { return this._name_ }

    @property(
        {
            visible() { return this._description_ },
            tooltip: "A short description about this object."
        }
    )
    get description() { return this._description_; }
    
}
