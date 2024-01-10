import {BaseMasterComponent} from "../../CC_pTS/ExpertComponent/BaseMasterComponent";
import {cc_support} from "../../CC_pTS/Support/CCSupporter";
import {graphic} from "../../Configer/Enum";

const {ccclass, property, requireComponent, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
@requireComponent(cc.Graphics)
export abstract class GPPCore extends BaseMasterComponent
{
    @property(cc.Graphics)
    __graphic__: cc.Graphics = null;
    @property(cc.Graphics)
    get graphic(): cc.Graphics { return this.__graphic__ }
    set graphic(value: cc.Graphics)
    {
        this.__graphic__ = value;
    }

    @property({ type: cc.Enum(graphic.ViewMode) })
    _view_mode_: graphic.ViewMode = graphic.ViewMode.BOTH;
    @property(
        {
            type: cc.Enum(graphic.ViewMode),
            visible() { return !!this.__graphic__ },
            tooltip: ``
        }
    )
    get view_mode(): graphic.ViewMode { return this._view_mode_ }
    set view_mode(value) { this._view_mode_ = value; this.draw(); }

    @property()
    _draw_mode_: graphic.DrawMode = graphic.DrawMode.BOTH;
    @property(
        {
            type: cc.Enum(graphic.DrawMode),
            visible() { return !!this.__graphic__ },
            tooltip: ``
        }
    )
    get draw_mode() { return this._draw_mode_ }
    set draw_mode(value) { this._draw_mode_ = value; this.draw(); }

    @property( 
        {
            visible() { return !!this.__graphic__ },
            tooltip: ``
        } 
    )
    enable_physic_helper: boolean = false;

    @property()
    _add_physic_: boolean = false;
    @property(
        {
            visible() { return this.enable_physic_helper },
            tooltip: ``
        } 
    )
    get add_physic() { return this._add_physic_ }
    set add_physic(value: boolean)
    {
        this._add_physic_ = value;
        if(value) this.__generate_physic();
        else this.__destroy_physic();
    }

    protected abstract __generate_physic(): void;
    protected abstract __destroy_physic(): void;

    @property()
    _add_collider_: boolean = false;
    @property(
        {
            visible() { return this.enable_physic_helper },
            tooltip: ``
        } 
    )
    get add_collider() { return this._add_collider_ }
    set add_collider(value: boolean)
    {
        this._add_collider_ = value;
        if(value) this.__generate_collider();
        else this.__destroy_collider();
    }

    protected abstract __generate_collider(): void;
    protected abstract __destroy_collider(): void;
    protected init()
    {
        if(CC_EDITOR)
        {
            if (!this.__graphic__) this.__graphic__ = cc_support.component.get_component(this.node, cc.Graphics)
            this.__graphic__.onChange = this.draw.bind(this);

            if(this.view_mode === graphic.ViewMode.BOTH || this.view_mode === graphic.ViewMode.EDITOR_ONLY) this.draw();
        }
        else
        {
            if(this.view_mode === graphic.ViewMode.BOTH || this.view_mode === graphic.ViewMode.PREVIEW_ONLY) this.draw();
            else this.destroy();
        }
    }

    protected abstract _draw_mechanic(): void;

    public draw()
    {
        if(CC_EDITOR && this.view_mode === graphic.ViewMode.PREVIEW_ONLY) { this.graphic.clear(); return; }
        this._draw_mechanic();
        this.__fill_color();
        if(this._add_physic_) this.__generate_physic();
        if(this._add_collider_) this.__generate_collider();
    }

    private __fill_color()
    {
        switch(this.draw_mode)
        {
            case graphic.DrawMode.FILL_ONLY:
                this.__graphic__.fill();
            break;
            case graphic.DrawMode.STROKE_ONLY:
                this.__graphic__.stroke();
            break;
            case graphic.DrawMode.BOTH:
                this.__graphic__.fill();
                this.__graphic__.stroke();
            break;
        }
    }
}
