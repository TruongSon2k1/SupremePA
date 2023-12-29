import {TSRObject} from "../../Root/TSRObject";

const {ccclass, property} = cc._decorator;

@ccclass('TSContentPreviewHelper')
export class TSContentPreviewHelper
{
    @property()
    _description_: string = "";
    @property()
    _name_: string = "";

    @property()
    get name() { return this._name_; }

    @property({ multiline: true })
    get description() { return this._description_; }

    @property()
    add_me: boolean = false;

    @property({ visible() { return this.add_me }})
    add_confirm: boolean = false;

    public reset()
    {
        this.add_confirm = false;
        this.add_me = false;
    }

    get is_add() { return this.add_me && this.add_confirm }

    public static create(object: TSRObject)
    {
        let ret = new TSContentPreviewHelper();
        ret._name_ = object.name;
        ret._description_ = object.description;
        return ret;
    }
}
