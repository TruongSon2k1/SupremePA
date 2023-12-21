import {FastComponent} from "./FastComponent";

const {property} = cc._decorator;

export abstract class FCChainAction extends FastComponent 
{
    abstract actions: any[];

    _action_: cc.Tween<any> = null

    @property(
        {
            type: cc.Integer,
            tooltip: `The amount of time looping this FastComponent. '0' mean infinite loop.`
        }
    )
    loop_time: number = 1

    protected abstract _generate_actions(): void;

    init()
    {
        this._action_ = cc.tween(this.node)
        this._generate_actions();
    }

    protected _mechanic(): void 
    {
        if(this.loop_time <= 0) cc.tween(this.node).repeatForever(this._action_).start();
        else cc.tween(this.node).repeat(this.loop_time, this._action_).start();
    }
}
