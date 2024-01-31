import {AnimatorController, IAnimationPlayer, IAnimatorStateLogicEvent} from "./AnimatorController";
import {AnimatorParams} from "./AnimatorParams";

const {ccclass, property, requireComponent} = cc._decorator;

@ccclass
@requireComponent(sp.Skeleton)
export class Animator extends cc.Component implements IAnimationPlayer, IAnimatorStateLogicEvent
{

    @property(
        {
            type: cc.JsonAsset
        }
    )
    json: cc.JsonAsset = null;

    @property(
        {
            
        }
    )
    auto_update: boolean = true; 

    spine: sp.Skeleton = null;
    state_logic: IAnimatorStateLogicEvent = null
    listeners: Function[] = []
    constroller: AnimatorController = null

    onLoad()
    {
        this.spine = this.node.getComponent(sp.Skeleton)
        if(this.json) this.set_url(this.json.json)
        this.spine.setCompleteListener(this.state_event.bind(this))
        this.spine.setEventListener(this.anim_event.bind(this))
    }

    private state_event(obj: any, trackIndex: any,type: any, event: any, loopCount: any): void
    {
        this.constroller.on_animation_event();
    }

    private anim_event(track: any, event: any): void
    {
        for(let i = 0; i < this.listeners.length; i++) this.listeners[i](track, event)
    }

    set_url(url: string)
    {
        this.constroller = new AnimatorController(this, url)
    }

    change_state(state: string)
    {
        this.constroller.change_state(state)
    }

    trigger(name: string): boolean
    {
        return this.constroller.on_trigger_event(name);
    }

    add_event_listener(cb: Function) { this.listeners.push(cb) }
    get current_state_name() { return this.constroller.current_state_name }
    get params(): AnimatorParams { return this.constroller.params }

    update()
    {
        if(this.auto_update) this.constroller.update();
    }

    fixUpdate()
    {
        if(!this.auto_update) this.constroller.update();
    }

    play(id: string, loop?: boolean): void 
    {
        loop = loop ? loop : false;
        this.spine.setAnimation(0, id, loop)
    }

    set_time_scale(scale: number): void 
    {
        if(scale > 0) this.spine.timeScale = scale;
    }

    on_change_state(from: string, to: string): void 
    {
        if(this.state_logic) this.state_logic.on_change_state(from, to);
    }

}
