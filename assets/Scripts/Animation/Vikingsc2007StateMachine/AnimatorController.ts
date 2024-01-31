import {Dictionary} from "../../pTS/Collection/Dictionary";
import {Animator} from "./Animator";
import {AnimatorParams} from "./AnimatorParams";
import {AnimatorState} from "./AnimatorState";

export interface IAnimatorJSParam
{
    id: string;
    type: number;
}

export interface IAnimatorJSCondition
{
    id: string;
    logic: number;
    type: number;
    value: number;
}

export interface IAnimatorJSTransition
{
    condition: IAnimatorJSCondition[];
    nextState: string;
}

export interface IAnimatorJSState
{
    animation: string;
    default: boolean;
    loop: boolean;
    multi: string;
    speed: number;
    state: string;
    transition: IAnimatorJSTransition[];
    x: number;
    y: number;
}
export interface IAnimatorJSon
{
    armatureInfor: {},
    parameter: IAnimatorJSParam[]
    state: IAnimatorJSState[]
}

export interface IAnimationPlayer extends IAnimatorStateLogicEvent
{
    play(id: string, loop?: boolean): void;
    set_time_scale(scale: number): void;
}

export interface IAnimatorStateLogicEvent
{
    on_change_state(from: string, to: string): void;
}

export class AnimatorController
{
    private _loaded_: boolean = false;
    private _state_data_: any;
    private _states_: Dictionary<AnimatorState>;

    private _current_state_: AnimatorState;
    private _param_: AnimatorParams
    private _player_: IAnimationPlayer;
    private _any_state_: AnimatorState; 

    get params(): AnimatorParams { return this._param_ }
    get current_state_name(): string { return this._current_state_.name }


    constructor(player: IAnimationPlayer, res_url: string | any)
    {
        this._player_ = player;

        this._states_ = Dictionary.create<AnimatorState>();
        this._param_ = new AnimatorParams();
        
        if(typeof res_url === 'string' )
        {
            cc.assetManager.loadAny(res_url, (err: Error, data: any) => {
                if (err) {console.warn(err); return;}

                this._state_data_ = data;
                this._loaded_ = true;
                this.init(data);
            })
        }
        else 
        {
            console.log(res_url)
            this._state_data_ = res_url;
            this._loaded_ = true;
            this.init(res_url)
        }
    }

    private init(data: IAnimatorJSon)
    {
        if(data.state.length <= 0) return;
        console.log(data.state)

        let default_state: string = "";

        for(let i = 0; i < data.state.length; i++)
        {
            let state: AnimatorState = new AnimatorState(data.state[i], this);
            this._states_.add(state.name, state)
            if(state.default) default_state = state.name;

            if(state.name == "anyState") this._any_state_ = state;
        }

        this.change_state(default_state)
    }

    private on_animation_complete()
    {
        this._current_state_.on_complete();
        if(this._current_state_ != this._any_state_ && this._any_state_ != null) this._any_state_.on_complete();
    }

    on_animation_event()
    {
        this.on_animation_complete();
    }

    on_trigger_event(name: string): boolean
    {
        if(this._current_state_.on_trigger(name)) return true;
        if(this._current_state_ != this._any_state_ && this._any_state_ != null) return this._any_state_.on_trigger(name);
        return false;
    }

    play(name: string) { this._player_.play(name) }
    set scale_time(value: number) { this._player_.set_time_scale(value) }


    change_state(state_name: string)
    {
        if(this._states_.is_contain(state_name) && ( this._current_state_ == null || this._current_state_.name != state_name ))
        {
            if(this._current_state_) console.log(`From ${this._current_state_.name} to ${state_name}`)
            else console.log(`From Empty to ${state_name}`)

            let old = this._current_state_;

            this._current_state_ = this._states_[state_name]

            if(this._current_state_.animation && this._current_state_.animation != "")
            {
                this._player_.play(this._current_state_.animation, this._current_state_.loop)
                {
                    if(this._player_ instanceof Animator)
                    {
                        let old_state_name = ""
                        if(old) old_state_name = old.name;
                        this._player_.on_change_state(old_state_name, this._current_state_.name);
                    }
                }
            }
        }
    }

    update()
    {
        if(!this._loaded_) return;
        this._current_state_.update();
        if(this._current_state_ != this._any_state_ && this._any_state_ != null) this._any_state_.update();
    }
}

