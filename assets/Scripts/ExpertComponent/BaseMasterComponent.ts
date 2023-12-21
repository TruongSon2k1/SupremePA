import {IBaseMasterClass} from "../pTS/Root/Interface/IBaseMasterClass";
import {IAssertOption, sup} from "../pTS/Support/Supporter";

const {ccclass, property} = cc._decorator;

export enum CleanerMode
{
    NONE,
    SELF_COMPONENT,
    OWNING_NODE
}

@ccclass
export abstract class BaseMasterComponent extends cc.Component implements IBaseMasterClass
{
    @property(
        {
            readonly: true,
            tooltip: "This is an [anti-duplicate] Component, which mean one Node can not contain two or more of this.",
            visible() { return !!this.anti_duplicate }

        }
    )
    protected anti_duplicate: boolean = false;

    @property(
        {
            readonly: true,
            type: cc.Enum(CleanerMode),
            tooltip: "This Component will do self clean up after being destroyed.\n + SELF_COMPONENT: Unschedule all callback and Tween action running inside this component. \n + OWNING_NODE: Do all clean stuff in <SELF_COMPONENT> state then stop all Actions, Tweens and unschedule all callback inside the Node containing this Component. [UNSAFE OPTION]",
            visible() { return this.cleaner_mode != CleanerMode.NONE },
        }
    )
    protected cleaner_mode: CleanerMode = CleanerMode.NONE;

    _name_: string;

    log(...params: any[]): void 
    {
        console.log("[" + this._name_ + "] Log: ", params)
    }

    warn(...params: any[]): void 
    {
        console.warn("[" + this._name_ + "] Warn: ", params)
    }

    error(...params: any[]): void 
    {
        console.error("[" + this._name_ + "] Error: ", params)
    }

    assert(cond: boolean, option: IAssertOption = sup.console.default_option)
    {
        if(!cond)
        {
            switch(option.mode)
            {
                case "crash":
                    if (!CC_EDITOR) throw new Error(option.message);
                    else Editor.error(option.message);
                case "break":
                    if(!CC_EDITOR) console.warn(option.message);
                    else Editor.warn(option.message);
                    debugger;
                    break; 
                case "warn":
                    if(!CC_EDITOR) console.warn(option.message);
                    else Editor.warn(option.message);
                    break; 
            }
        }
    }

    constructor()
    {
        super();
        this._name_ = sup.js.get_class_name(this);
    }

    onLoad(): void 
    {
        this.anti_duplicate_function();
        this.init();
    }

    protected anti_duplicate_function()
    {
        this.assert(!this.anti_duplicate,
                    {
                        mode: 'crash',
                        message: "This Component named: " + this._name_ + " is marked as 'anti-duplicate', so please override the 'anti_duplicate_function()' method of it." 
                    })
    }



    protected onDestroy(): void 
    {
        this.pre_cleanup();
        switch(this.cleaner_mode)
        {
            case CleanerMode.SELF_COMPONENT:
                this.self_component_cleanup();
                break;
            case CleanerMode.OWNING_NODE:
                this.self_component_cleanup();
                this.component_node_cleanup();
                break;
        }
        this.after_cleanup();
    }

    protected init(): void {}
    protected pre_cleanup(): void {}
    protected after_cleanup(): void {}

    protected self_component_cleanup() 
    {
        this.unscheduleAllCallbacks();
        cc.Tween.stopAllByTarget(this);
    }

    protected component_node_cleanup()
    {
        cc.Tween.stopAllByTarget(this.node);
        this.node.stopAllActions();
    }

}
