import {Dictionary} from "../../pTS/Collection/Dictionary";
import {AnimatorCondition} from "./AnimatorCondition";
import {AnimatorController, IAnimatorJSState} from "./AnimatorController";
import {AnimatorTransition} from "./AnimatorTransition";


export class AnimatorState
{
    name: string = ""
    animation: string;
    loop: boolean = false;
    speed: number = 1;
    multi: string = "";

    transitions: Dictionary<AnimatorTransition>
    default: boolean = false;

    controller: AnimatorController;

    constructor(data: IAnimatorJSState, controller: AnimatorController)
    {
        this.name = data.state;
        this.animation = data.animation;

        if(data.default) this.default = true;
        this.transitions = Dictionary.create<AnimatorTransition>();
        this.controller = controller;
        this.loop = data.loop;

        this.speed = (data.speed==undefined || data.speed==null) ? 1 : data.speed;

        this.multi = data.multi ? data.multi : "None";

        for(let i = 0; i < data.transition.length; i ++) 
        {
            let transition: AnimatorTransition = new AnimatorTransition(data.transition[i], controller);
            this.transitions.add(transition.to_state_name, transition);
        }

    }

    update(): void
    {
        let playspeed = this.speed;

        if(this.multi != "None") playspeed = playspeed * (this.controller.params.get_property_value(this.multi, 1) as number);

        this.controller.scale_time = playspeed;

        for(let i = 0; i < this.transitions.values.length; i++)
        {
            let transition: AnimatorTransition = this.transitions.values[i];
            if (transition.can(AnimatorCondition.CHECK_ON_UPDATE)) {
                transition.trans();
                return;
            }

        }
    }

    on_complete(): void
    {
        for(let i = 0; i < this.transitions.values.length; i++)
        {
            let transition: AnimatorTransition = this.transitions.values[i]
            if(transition.can(AnimatorCondition.CHECK_ON_COMPLETE))
            {
                transition.trans();
                return
            }
        }
    }

    on_trigger(name: string): boolean
    {
        for(let i = 0; i < this.transitions.values.length; i++)
        {
            let transition: AnimatorTransition = this.transitions.values[i]
            if(transition.can(AnimatorCondition.CHECK_ON_TRIGGER, name))
            {
                transition.trans();
                return true;
            }
        }
        return false;
    }

}
