import {Dictionary, IDictionaryData} from "../../pTS/Collection/Dictionary";
import {mark_singleton} from "../../pTS/Support/Decorators";
import {Instance} from "../../pTS/Support/Functions";
import {pTS} from "../../pTS/Support/pTSupport";
import {IJSonDictionary} from "../Interface/IJSONData";

const {ccclass, property} = cc._decorator

@ccclass('SZDictionary')
export class SZDictionary<K> extends Dictionary<K>
{
    @property(
        {
            type: [cc.String],
            override: true
        }
    )
    _keys_: string[] = [];

    @property(
        {
            type: [undefined],
            override: true,
        }
    )
    _values_: K[] = [];

    @property(
        {
            type: [cc.String],
            override: true,
        }
    )
    get keys(): string[] { return this._keys_ }
    
    @property(
        {
            type: [undefined],
            override: true,
            serializable: true,
        }
    )
    get values(): K[] { return this._values_ }

    static create<K>(data: { key: string; value: K}[] = [])
    {
        let ref = new SZDictionary<K>();

        for (const ret of data) 
        {
            ref.add(ret.key, ret.value);
        }

        return ref;
    }
}

@mark_singleton
class JSonDictionary
{
    to_json<K>(target: IDictionaryData<K>): string
    {
        if(!target || target.values.length <= 0 || target.values.length != target.keys.length) return "";

        const obj: IJSonDictionary<K> = {
            type: pTS.js.get_class_name(target.values[0]),
            data: target
        }

        return JSON.stringify(obj);
    }

}

export const jd = Instance(JSonDictionary)


