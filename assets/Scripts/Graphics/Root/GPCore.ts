import {BaseMasterComponent} from "../../CC_pTS/ExpertComponent/BaseMasterComponent";
import {graphic} from "../../Configer/Enum";

const {ccclass, property, executeInEditMode, requireComponent} = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(cc.Graphics)
export abstract class GPCore extends BaseMasterComponent
{
    @property({type: cc.Graphics, visible: false})
    _graphic_: cc.Graphics = null;
    get graphic(): cc.Graphics
    {
        if(!this._graphic_) this._graphic_ = this.getComponent(cc.Graphics)
        if(!this._graphic_) this._graphic_ = this.addComponent(cc.Graphics)
        return this._graphic_
    }
    
    @property(
        {

        }
    )
    previewer_clean: boolean = false;

    @property(
        {

        }
    )
    updater: boolean = false;
    @property
    _type_: graphic.DrawMode = graphic.DrawMode.FILL_ONLY;
    @property(
        {
            type: cc.Enum(graphic.DrawMode)
        }
    )
    get type() { return this._type_ }
    set type(value: graphic.DrawMode)
    {
        this._type_ = value;
        this.gender();
    }
    onLoad(): void 
    {
        if(CC_EDITOR)
        {
            if(!this._graphic_) this._graphic_ = this.getComponent(cc.Graphics)
            this.graphic.onChange = () => this.gender();
            this.gender();
        }

        else 
        {
            if (this.previewer_clean) this.destroy()
            else this.gender();
        console.log(this.node)
        }
    }

    update(dt: number): void
    {
        if(CC_EDITOR)
        {
            if(this.updater) this.gender();
            this.e_update(dt)
        }
        else this.g_update(dt);
    }

    gender()
    {
        this.draw();
        this.color_up();
    }

    abstract draw(): void
    protected e_update(dt: number): void {}
    protected g_update(dt: number): void {}

    color_up()
    {
        switch(this.type)
        {
            case graphic.DrawMode.FILL_ONLY:
                this.graphic.fill();
                break;
            case graphic.DrawMode.STROKE_ONLY:
                this.graphic.stroke();
                break;
            case graphic.DrawMode.BOTH:
                this.graphic.fill();
                this.graphic.stroke();
                break;
        }
    }
}
