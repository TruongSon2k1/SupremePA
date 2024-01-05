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

    @property()
    _enable_physic_helper_: boolean = false;
    @property()
    get enable_physic_helper() { return this._enable_physic_helper_ }
    set enable_physic_helper(value: boolean)
    {
        this._enable_physic_helper_ = value;
        if(value) return;
        this.add_physic = false;
        this.add_collider = false;
    }

    @property()
    _add_physic_: boolean = false
    @property({ visible() { return this.enable_physic_helper } })
    get add_physic() { return this._add_physic_ }
    set add_physic(value)
    {
        this._add_physic_ = value;
        if(value) this.__generate_physic();
        else this.__destroy_physic();
    }

    protected abstract __generate_physic(): void;
    protected abstract __destroy_physic(): void;

    @property()
    _add_collider_: boolean = false
    @property({ visible() { return this.enable_physic_helper } })
    get add_collider() { return this._add_collider_ }
    set add_collider(value)
    {
        this._add_collider_ = value
        if(value) this.__generate_collider();
        else this.__destroy_collider();
    }

    protected abstract __generate_collider(): void;
    protected abstract __destroy_collider(): void;

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
        if(this._add_physic_) this.__generate_physic();
        if(this._add_collider_) this.__generate_collider();
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
