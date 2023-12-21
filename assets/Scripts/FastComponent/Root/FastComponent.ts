import {StartUpMode} from "../../Configer/Enum";
import {BaseMasterComponent} from "../../ExpertComponent/BaseMasterComponent";

const {ccclass, property, executeInEditMode} = cc._decorator;

@ccclass
@executeInEditMode
export abstract class FastComponent extends BaseMasterComponent
{
    @property(
        {
            tooltip: `Set up the start state of this 'FastComponent'.
                \n + NONE: This 'FastComponent' will not be called at the start state, but it can still be called by Event-Emmiter.
                \n + ON_LOAD: Called at the 'onLoad()' state which mean it will be called very early, make sure other Components that this FastComponent depend on are onLoaded. [Dangerous choice]
                \n + START: Called at the 'start()' state, this will be called after every Node's component are all onLoaded. [Safe choice]
                \n + Enable: Called at the 'onEnable()' state, this will be called after every node are done started. [Not recommend]
                \n + ONLOAD_ENABLE: Called at the 'onLoad()' state, but every time this component enabled, this 'FastComponent' will be called. [Better understand what you are doing]
                \n + START_ENABLE: Same to 'ONLOAD_ENABLE', but at 'start()' state. [Better understand what you are doing]
                \n
                \n Default: NONE`,
            type: cc.Enum(StartUpMode)
        }
    )
    start_state: StartUpMode = StartUpMode.NONE;

    @property(
        {
            tooltip: `The amount of time to await before executing the Mechanic of this 'FastComponent'.
                     \n Default: 0`,
            min: 0
        }
    )
    pre_delay: number = 0;

    @property()
    _enable_logger_: boolean = true;
    @property(
        {
            tooltip: `Throw a logger at the console to announce the execution of this 'FastComponent'.
                     \n Default: True`
        }
    )
    get enable_logger(): boolean { return this._enable_logger_ }
    set enable_logger(value: boolean)
    {
        this._enable_logger_ = value
        if(!value) this.custom_logger = ""
    }

    @property(
        {
            tooltip: `A custom string logger to log out after this component is executed.`,
            visible() { return this._enable_logger_ }
        }
    )
    custom_logger: string = "";

    @property(
        {
            tooltip: `Determine how many time this 'FastComponent' can be executed.
                     \n + [Note] Set '0' mean it can be executed infinitely.
                     \n Default: 1`,
            type: cc.Integer,
            min: 0
        }
    )
    max_run_time: number = 1;

    _run_time_: number = 0;                                     //< Counting the runtime of this component.

    @property(
        {
            tooltip: `The duration of this FastComponent's execution.`
        }
    )
    get total_time_cost(): string
    {
        return this.pre_delay + " + " + this.time_cost + " = " + (this.pre_delay + this.time_cost) + "s";
    }


    protected abstract get time_cost(): number;

    private _runtime_checker(): boolean
    {
        if(this.max_run_time <= 0) return true;
        return this._run_time_ < this.max_run_time;
    }

    protected abstract _mechanic(): void;

    private _executor(): void
    {
        this._run_time_ ++;    
        this._mechanic();
    }

    private _execution_logger()
    {
        this.log("Executed!!", "Message: ", "Reference: ", this, this.node);
    }

    public execute()
    {
        if(this._runtime_checker())
        {
            this.scheduleOnce( () =>
            {
                this._executor();
                if(this._enable_logger_) this._execution_logger();
            }, this.pre_delay)
        }
    }

    _oned_: boolean = false;                            //< 

    onLoad()
    {
        super.onLoad();
        if(CC_EDITOR) return;
        
        switch(this.start_state)
        {
            case StartUpMode.ON_LOAD:
                this.execute();
                break;
            case StartUpMode.ONLOAD_ENABLE:
                this.execute();
                this._oned_ = true;
                break;
        }
    }

    protected start(): void 
    {
        if(CC_EDITOR) return;

        switch(this.start_state)
        {
            case StartUpMode.START:
                this.execute();
                break;
            case StartUpMode.START_ENABLE:
                this.execute();
                this._oned_ = true;
                break;
        }
    }

    protected onEnable(): void 
    {
        if(CC_EDITOR) return;

        switch(this.start_state)
        {
            case StartUpMode.ENABLE:
                this.execute();
                break;
            case StartUpMode.ONLOAD_ENABLE:
                if(this._oned_) this.execute();
                break;
            case StartUpMode.START_ENABLE:
                if(this._oned_) this.execute();
                break;
        }
    }
}

