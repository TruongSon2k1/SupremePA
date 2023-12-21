import {BaseMasterClass} from "../Root/Class/BaseMasterClass";

export class BaseMasterFactory<T> extends BaseMasterClass
{
    /**
     * @description
     * | Create a new instance of the object that registered inside the `creator` if the input `id` is registered.
     *
     * @param {string} id The indentify of the object that registered inside the creator. 
     *
     * @returns {T} A new instance of the object registered with the input id.
     */
    public generate(id: string): T
    {
        let it = this._creator_.get(id);
        if(!it)
        {
            this.warn(`There is no object registered with the given id: ${id} in the creators list.`); 

            return null;
        }
        return new it();
    }

    /**
     * @description
     * | Register a new object to the `creator` with the given `id`.
     * | Make sure the `id` is an unique one which mean, no `object` that registered with that id before.
     *
     */
    public register(id: string, creator: new () => T)
    {
        if(this.assert(!this._creator_.has(id),
                    {
                        mode: 'warn',
                        message: `The class named ${id} is already registered inside the creator.`
                    }))
        {
            this._creator_.set(id, creator);
        }
    }

    protected init()
    {
        this._creator_ = new Map<string, new () => T>();
    }

    private _creator_: Map<string, new () => T>;
    public get get() { return this._creator_ }

}
