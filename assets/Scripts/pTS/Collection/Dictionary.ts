
export interface IDictionaryData<K>
{
    keys: string[];
    values: K[];
}

export interface IDictionary<K> extends IDictionaryData<K>
{
    add(key: string, value: K): void;
    remove(key: string): void;
    is_contain(key: string): boolean;
}

export class Dictionary<K> implements IDictionary<K>
{
    protected _keys_: string[] = [];
    protected _values_: K[] = [];

    public static create<K>(data: { key: string; value: K}[] = null)
    {
        let ref = new Dictionary<K>();

        if (data) 
        {
            for (const ret of data) 
            {
                ref.add(ret.key, ret.value);
            }
        }
        return ref
    }

    public add(key: string, value: K): void 
    {
        this[key] = value;
        this._keys_.push(key);
        this._values_.push(value);
    }

    public remove(key: string): void 
    {
        var index = this._keys_.indexOf(key, 0);
        this._keys_.splice(index, 1);
        this._values_.splice(index, 1);

        delete this[key];
    }

    public is_contain(key: string): boolean 
    {
        return !(typeof this[key] === 'undefined')
    }

    public get keys(): string[] 
    {
        return this._keys_;
    }

    public get values(): K[] 
    {
        return this._values_;
    }

    public get first(): K
    {
        if(this._values_[0] === "undefined") return null;
        return this._values_[0];
    }
}
