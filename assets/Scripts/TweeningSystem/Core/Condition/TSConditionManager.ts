import {BaseMasterClass} from "../../../pTS/Root/Class/BaseMasterClass";
import {TSConditionPreviewObject} from "../../Editor/Condition/TSConditionPreviewObject";
import {ResetType} from "../../Helper/TSEnum";
import {TSACondition} from "./TSACondition";

export abstract class TSAConditionManager extends BaseMasterClass
{
    public _silent_: boolean = true;

    public conditions: TSACondition[] = []
    
    public abstract get is_valid(): boolean;

    public ctor(): boolean
    {
        if(this.conditions.length <= 0) return false;
        for(const ret of this.conditions) ret.ctor();
        return true;
    }

    public enter_collision(other: cc.Collider, self: cc.Collider)
    {
        for(const ret of this.conditions) ret.enter_collision(other, self);
    }

    public exit_collision(other: cc.Collider, self: cc.Collider)
    {
        for(const ret of this.conditions) ret.exit_collision(other, self);
    }

    update(dt: number)
    {
        for(const ret of this.conditions)
        {
            ret.update(dt);
        }
    }
}

export class TSConditionORManager extends TSAConditionManager
{
    _reset_type_: ResetType = ResetType.THIS;

    public get is_valid(): boolean 
    {
        for(const ret of this.conditions)
        {
            if(ret.is_passed) 
            {
                if(!this._silent_) this.log(`Passing condition at: `, ret);
                switch(this._reset_type_)
                {
                    case ResetType.THIS:
                        ret.reset();
                        return true;
                    case ResetType.ALL:
                        for(const temp of this.conditions) temp.reset();
                        return true;
                }
            }
        }
        return false;
    }

    public static create(type: ResetType = ResetType.THIS, list: TSConditionPreviewObject[], silent: boolean): TSConditionORManager
    {
        let ret = new TSConditionORManager();
        ret._reset_type_ = type;
        ret._silent_ = silent;
        for(const temp of list) ret.conditions.push(temp.action);
        return ret;
    }
}

export class TSConditionANDManager extends TSAConditionManager
{
    public get is_valid(): boolean 
    {
        return this.conditions.every(ret => ret.is_passed)
    }

    public static create(list: TSConditionPreviewObject[], silent: boolean): TSConditionANDManager
    {
        let ret = new TSConditionANDManager();
        ret._silent_ = silent
        for(const temp of list) ret.conditions.push(temp.action);
        return ret;
    }
}
