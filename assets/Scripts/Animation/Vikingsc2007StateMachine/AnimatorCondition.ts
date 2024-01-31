import {AnimatorController, IAnimatorJSCondition} from "./AnimatorController";


export class AnimatorCondition
{
    static LOGIC_EQUAL: number = 0;
    static LOGIC_GREATER: number = 1;
    static LOGIC_LESS: number = 2;
    static LOGIC_NOTEQUAL: number = 3

    static TYPE_COMPLETE: number = 0;
    static TYPE_BOOL: number = 1;
    static TYPE_NUMBER: number = 2;
    static TYPE_TRIGGER: number = 3;

    static CHECK_ON_UPDATE: number = 1;
    static CHECK_ON_COMPLETE: number = 2;
    static CHECK_ON_TRIGGER: number = 3;
    

    controller: AnimatorController;
    value: number = 0;
    logic: number = 0;
    id: string = "";
    type: number = 3;

    constructor(data: IAnimatorJSCondition, controller: AnimatorController)
    {
        this.controller = controller;
        this.value = data.value;
        this.logic = data.logic;
        this.id = data.id;
        this.type = data.type;
    }

    check(check_type: number, trigger_name: string): boolean
    {
        let value: number = this.controller.params.get_property_value(this.id) as number;

        if(this.type === AnimatorCondition.TYPE_BOOL) return value == this.value;

        if(this.type == AnimatorCondition.TYPE_NUMBER)
        {
            switch(this.logic)
            {
                case AnimatorCondition.LOGIC_EQUAL:
                    return this.value == value;
                case AnimatorCondition.LOGIC_GREATER:
                    return this.value < value;
                case AnimatorCondition.LOGIC_LESS:
                    return this.value > value;
                case AnimatorCondition.LOGIC_NOTEQUAL:
                    return this.value != value;
            }
            return false;
        }

        if(this.type == AnimatorCondition.TYPE_COMPLETE) return check_type == AnimatorCondition.CHECK_ON_COMPLETE;

        if(this.type == AnimatorCondition.TYPE_TRIGGER) 
        {
            if (check_type == AnimatorCondition.CHECK_ON_TRIGGER) return this.id == trigger_name;
            return false;
        }

        return !(this.type == 0);
    }
}
