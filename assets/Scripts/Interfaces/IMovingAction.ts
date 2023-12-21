import {ByTo} from "../Configer/Enum";

export interface IMovingAction
{
    type: ByTo;
    duration: number;
    target: cc.Vec3;
    easing: string;
}

export interface IBezierAction extends IMovingAction
{
    tempo_1?: cc.Vec2;
    tempo_2?: cc.Vec2;
}
