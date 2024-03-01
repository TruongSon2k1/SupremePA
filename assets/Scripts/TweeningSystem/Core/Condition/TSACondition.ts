import {IJSonData, IJSonObject} from "../../../CC_pTS/Interface/IJSONData";
import {IQuickFactoryManager} from "../../../Interfaces/IQuickFactoryManager";
import {FactoryManager} from "../../../pTS/Factory/FactoryManager";
import {fm_quick_reg} from "../../../pTS/Support/Decorators";
import {Instance} from "../../../pTS/Support/Functions";
import {ITSCondition} from "../../Component/ITweeningComponent";
import {ExecutionType, RuntimeType} from "../../Helper/TSEnum";
import {TSRObject} from "../../Root/TSRObject";
import {TSAConditionExecutor, TSANormalConditionExecutor, TSAOverloadingExecutor} from "./TSAConditionExecutor";
import {TSACNormalRuntime, TSAConditionRuntime} from "./TSAConditionRuntime";

const {ccclass, property} = cc._decorator;

@fm_quick_reg()
@ccclass('TSACondition')
export abstract class TSACondition extends TSRObject implements ITSCondition
{
/// EDITOR ZONE ////////////////////////////////////////////////////////////////
        
    @property({type: cc.Enum(RuntimeType)})
    _runtime_type_: RuntimeType = RuntimeType.NORMAL;
    @property({type: cc.Enum(RuntimeType)})
    get runtime_type() { return this._runtime_type_ }
    set runtime_type(value: RuntimeType)
    {
        if(value != this._runtime_type_)
        {
            this._runtime_type_ = value;
            this.runtimer = this.runtimer_creator()
        }
    }

    @property({type: cc.Enum(ExecutionType)})
    _execution_type_: ExecutionType = ExecutionType.NORMAL;
    @property(
        {
            type: cc.Enum(ExecutionType), 
            tooltip: `Please choose how this condition do the execution. \n+ [NORMAL] Direct invoke the passed time. 
                \n+ [OVERLOAD] This condition only can be executing pass action after a certain a mount of time (Await Clock).`
        }    
    )
    get execution_type() { return this._execution_type_ }
    set execution_type(value: ExecutionType) 
    {
        if(value != this._execution_type_)
        {
            cc.js.clear(this.executor);
            this._execution_type_ = value; 
            this.executor = this.executor_creator();
            return;
        }
    }

    @property({displayName: 'Line'}) get line() { return "[ INFOR ] ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^"}

    @property({type: TSAConditionRuntime, visible() { return this.runtimer } })
    runtimer: TSAConditionRuntime = this.runtimer_creator();

    @property({type: undefined})
    optional?: IJSonObject = null;

    runtimer_creator(): TSAConditionRuntime
    {
        switch(this._runtime_type_)
        {
            case RuntimeType.NORMAL:
            return TSACNormalRuntime.create();
        }
    }

    executor_creator(): TSAConditionExecutor
    {
        switch(this._execution_type_)
        {
            case ExecutionType.NORMAL:
                return TSANormalConditionExecutor.create();
            case ExecutionType.OVERLOADING:
                return TSAOverloadingExecutor.create();
        }
    }

    @property({ type: TSAConditionExecutor, visible() { return this.executor } })
    executor: TSAConditionExecutor = this.executor_creator();

    @property({displayName: 'Line'}) get line2() { return "[ OPTIONS ] vvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv"}

/// CORE FUNCTION ZONE ////////////////////////////////////////////////////////////////////
    
    /**
     * @description
     * | Check if this Condition is passed or not.
     *
     * @returns {boolean} True if its passed. False otherwise
     *
     */
    public get is_passed(): boolean
    {
        return this.runtimer.is_passed;
    }

    public ready_up(): void
    {
        this.runtimer._is_passed_ = this.executor.ready();
    }

    public reset()
    {
        this._reset();
        this.runtimer.reset();
    }

/// CORE ABSTRACT ZONE ////////////////////////////////////////////////////////////////////

    protected abstract _reset(): void;
    public abstract ctor(): void;
    public abstract update(dt: number): void;

/// JSON ZONE /////////////////////////////////////////////////////////////////////////////

    public to_json():string
    {
        let data = null;

        if(this.optional) data = this.optional.to_json();

        return `
        {
            "name": "${this.name}",
            "runtime_type": ${JSON.stringify(this.runtime_type)},
            "execution_type": ${JSON.stringify(this.execution_type)},
            "optional": ${data},
            "runtimer": ${this.runtimer.to_json()},
            "executor": ${this.executor.to_json()}
        }
        `
    };

    public to_js_data(): IJSonData
    {
        const json: IJSonData = {
            type: cc.js.getClassName(this),
            data: this
        }

        return json;
    }

    init_from_data(data: IJSonData): void 
    {
        const ret = data.data;

        this.runtime_type = ret.runtime_type;
        this.execution_type = ret.execution_type;
        this.optional.init_from_data(ret.optional)
    }

/// COLLISION ZONE ////////////////////////////////////////////////////////////////////////

    public enter_collision(other: cc.Collider, self: cc.Collider) {}
    public exit_collision(other: cc.Collider, self: cc.Collider) {}

/// LIFE CYCLE ZONE ///////////////////////////////////////////////////////////////////////

    /**
     * @description
     * | Only call at edtior mode.
     */
    public e_updater(dt: number = 0): void {}
    public destroy() {}
}

export const _TSQCond_: IQuickFactoryManager = 
    {
        string: "TSACondition",
        creator: Instance(FactoryManager).get<ClassType<TSACondition>>("TSACondition"),
        generator: function (id: string) {
            const ret = Instance(FactoryManager).get<ClassType<TSACondition>>("TSACondition").generate(id);
            //@ts-ignore
            return new ret();
        }
    }

