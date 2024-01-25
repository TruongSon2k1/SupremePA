import {IAnimatorStateLogicEvent} from "./AnimatorController";

const {ccclass, property} = cc._decorator;

@ccclass
export class Animator extends cc.Component 
{
    @property(
        {
            type: cc.JsonAsset
        }
    )
    asset_url: cc.JsonAsset = null;

    @property(
        {
            
        }
    )
    auto_update: boolean = true; 

    state_logic: IAnimatorStateLogicEvent = null

    @property(
        {
            type: sp.Skeleton
        }
    )
    spine: sp.Skeleton = null;

    listeners: Function[] = []


}
