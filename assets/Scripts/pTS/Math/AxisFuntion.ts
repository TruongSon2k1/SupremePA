
import {pTS} from '../Support/pTSupport';
import * as IM from './IMath'

export interface IBezier
{
    sp: IM.IVec2;
    mp: IM.IVec2;
    ep: IM.IVec2;
}

export namespace axis_function
{

    export type Callback = (data: IBezier, delta: number) => IM.IVec2;

    export function bezier (C1: number, C2: number, C3: number, C4: number, t: number): number
    {
        var t1 = 1 - t;
        return t1 * (t1 * (C1 + (C2 * 3 - C1) * t) + C3 * 3 * t * t) + C4 * t * t * t;
    }

    export function quad_curve(data: IBezier, dt: number): IM.IVec2
    {
        const temp = 1 - dt;
        let x = ( temp * temp * data.sp.x ) + ( 2 * temp * dt * data.mp.x ) + ( dt * dt * data.ep.x )
        let y = ( temp * temp * data.sp.y ) + ( 2 * temp * dt * data.mp.y ) + ( dt * dt * data.ep.y )
        return { x: x, y: y }
    }

    export function bezier_curve(data: IBezier, delta: number): IM.IVec2
    {
        Editor.log(data.sp, data.mp, data.ep, "")
        const x = bezier(data.sp.x, data.sp.x, data.mp.x, data.ep.x, delta)
        const y = bezier(data.sp.y, data.sp.y, data.sp.y, data.sp.y, delta)

        return { x: x, y: y }
    }

    function array_of_curves(data: IBezier, length: number, callback: Callback) : IM.IVec2[]
    {
        length = pTS.numeric.to_int(length);
        let arr: IM.IVec2[] = [];

        if(length > 0)
        {
            for (let t = 0; t <= length; t++) 
            {
                arr.push(callback(data, t / length));
            }
        }
        return arr;
    }

    export function array_bezier_curves(data: IBezier, length: number): IM.IVec2[]
    {
        return array_of_curves(data, length, bezier_curve);
    }

    export function array_quadratic_curves(data: IBezier, length: number): IM.IVec2[]
    {
        const callback: Callback = () => { return quad_curve(data, length) }
        return array_of_curves(data, length, quad_curve);
    }
}
