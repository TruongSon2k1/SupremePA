import {AnimatorCondition} from "./AnimatorCondition";
import {AnimatorController, IAnimatorJSTransition} from "./AnimatorController";

export class AnimatorTransition
{
    to_state_name: string = "";     
    conditions: AnimatorCondition[] = [];
    controller: AnimatorController = null;

    constructor(data: IAnimatorJSTransition, controller: AnimatorController)
    {
        this.to_state_name = data.nextState;
        this.controller = controller;

        for(let i = 0; i < data.condition.length; i++)
        {
            let condition: AnimatorCondition = new AnimatorCondition(data.condition[i], controller);
            this.conditions.push(condition);
        }
    }

    can(check_type: number, trigger_name?: string): boolean
    {
        if(this.to_state_name == this.controller.current_state_name) return false;

        let cando: boolean = true;

        for(let i = 0; i < this.conditions.length; i++) cando = (cando && this.conditions[i].check(check_type, trigger_name))

        return cando;
    }

    trans(): void
    {
        this.controller.change_state(this.to_state_name)
        console.log(this.controller)
    }
}
