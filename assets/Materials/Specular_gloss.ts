const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(cc.Sprite)
export default class SpecularGloss extends cc.Component 
{
    @property(
        {
            type: cc.Material
        }
    )
    mat!: cc.Material;

    @property(
        {
            min: 0,
            max: 1
        }
    )
    width: number = 0.2;

    @property(
        {

        }
    )
    strength: number = 1.5;

    @property(
        {

        }
    )
    speed: number = 1;
    @property(
        {
            
        }
    )
    lerper: number = 0.2;

    _sprite_!: cc.Sprite;

    protected onLoad(): void 
    {
        this._sprite_ = this.node.getComponent(cc.Sprite);
        let mat = cc.MaterialVariant.create(this.mat, this._sprite_);
        
        mat.setProperty('width', this.width);
        mat.setProperty('strength', this.strength);
        mat.setProperty('timer', this.speed);
        mat.setProperty('lerper', this.lerper)

        this._sprite_.setMaterial(0, mat)
        for(let i = 0; i < this._sprite_.getMaterials().length; i ++)
        {
            this.logger(i)
        }
    }

    logger(index)
    {
        const v = this._sprite_.getMaterial(index);
        //@ts-ignore
        const ret = v._effect._passes;
        for (const t of ret) {
            console.log(t._properties);
        }
    }
}
