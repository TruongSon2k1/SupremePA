import {IBaseMasterClass} from "../../pTS/Root/Interface/IBaseMasterClass";
import {DefaultAssertOption, IAssertOption} from "../../pTS/Support/ISupport";
import {pTS} from "../../pTS/Support/pTSupport";
import {cc_support} from "../Support/CCSupporter";

const {ccclass, property} = cc._decorator;

const js = pTS.js

export enum CleanerMode
{
    NONE,
    SELF_COMPONENT,
    OWNING_NODE
}

export enum AntiDuplicateLevel
{
    NONE,
    CURRENT_NODE,
    SINGLETON

}

@ccclass
export abstract class BaseMasterComponent extends cc.Component implements IBaseMasterClass
{
    @property(
        {
            readonly: true,
            tooltip: "This is an [anti-duplicate] Component, which mean one Node can not contain two or more of this.",
            visible() { return this.anti_duplicate !== AntiDuplicateLevel.NONE },
            type: cc.Enum(AntiDuplicateLevel)

        }
    )
    protected anti_duplicate: AntiDuplicateLevel = AntiDuplicateLevel.NONE;

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
        cc_support.console.log("[" + this._name_ + "] Log: ", params);
    }

    warn(...params: any[]): void 
    {
        cc_support.console.warn("[" + this._name_ + "] Warn: ", params);
    }

    error(...params: any[]): void 
    {
        cc_support.console.error("[" + this._name_ + "] Error: ", params);
    }

    assert(cond: boolean, option: IAssertOption = DefaultAssertOption)
    {
        cc_support.console.assert(cond, option);
    }

    constructor()
    {
        super();
        this._name_ = js.get_class_name(this);
    }

    onLoad(): void 
    {
        this.anti_duplicate_function();
        this.init();
    }

    protected anti_duplicate_function()
    {
        switch(this.anti_duplicate)
        {
            case AntiDuplicateLevel.CURRENT_NODE:
                const components = this.getComponents(cc.Component);
                for(const ret of components)
                {
                    if (ret != this && ret.constructor === this.constructor && ret.uuid != this.uuid) 
                    {
                        this.warn('Detect duplicate Component!!')
                        Editor.warn('Detect duplicate Component!!')
                        this.destroy();
                        return;
                    }
                }
                return;
            case AntiDuplicateLevel.SINGLETON:
                if(!this.anti_duplicate) return;
                const papa = cc_support.component.find_root_node(this.node)
                if(cc_support.component.count_component(papa, js.get_class_name(this)) > 1)
                {

                    this.warn('Detect duplicate Component in the whole world!!' )
                    if(CC_EDITOR) Editor.warn('Detect duplicate Component in the whole world!!' )
                    this.destroy();
                }

                return;
        }
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
