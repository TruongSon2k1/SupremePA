
const {ccclass} = cc._decorator;

@ccclass
export class AnimatorParams extends cc.Component 
{
    private property: any = {}

    public set_property_value(key: string, value: number | boolean): void
    {
        this.property[key] = value;
    }

    public get_property_value(key: string, default_val: number = 0): number | boolean
    {
        const data = this.property[key]
        if(data) if(typeof data == 'number' || typeof data == 'boolean') return data;
        return default_val;
    }
}
