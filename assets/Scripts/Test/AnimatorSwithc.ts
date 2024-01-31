import {Animator} from "../Animation/Vikingsc2007StateMachine/Animator";

const {ccclass, property} = cc._decorator;

@ccclass
export class AnimatorSwitch extends cc.Component {

    @property(Animator)
    animator: Animator = null

    to_walk()
    {
        this.animator.change_state('Walk')
    }


    to_run()
    {

        this.animator.change_state('Run')
    }

    to_idle()
    {
        this.animator.change_state('Idle')
    }
}
