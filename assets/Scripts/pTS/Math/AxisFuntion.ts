
import {BaseMasterClass} from '../Root/Class/BaseMasterClass';
import {numeric} from '../Support/NUMERIC';
import * as IM from './IMath'

export class BezierCurves extends BaseMasterClass
{
    static zero()
    {
        return BezierCurves.create(IM.DefaultIVec2, IM.DefaultIVec2, IM.DefaultIVec2);
    }

    static create(start: IM.IVec2, mid: IM.IVec2, end: IM.IVec2)
    {
        let quad = new BezierCurves();
        quad.set(start, mid, end);
        return quad;
    }

    set(start: IM.IVec2, mid: IM.IVec2, end: IM.IVec2)
    {
        this.start = start;
        this.mid = mid; 
        this.end = end;
    }

    reset()
    {
        this.set(IM.DefaultIVec2, IM.DefaultIVec2, IM.DefaultIVec2)
    }

    private _start_: IM.IVec2 = IM.DefaultIVec2;
    private _mid_: IM.IVec2 = IM.DefaultIVec2;
    private _end_: IM.IVec2 = IM.DefaultIVec2;

    get start() { return this._start_ }
    set start(value: IM.IVec2) 
    {
        this._start_ = value;
    }

    get mid() { return this._mid_ }
    set mid(value: IM.IVec2) 
    {
        this._mid_ = value;
    }

    get end() { return this._end_ }
    set end(value: IM.IVec2) 
    {
        this._end_ = value;
    }

    private bezier (C1: number, C2: number, C3: number, C4: number, t: number) 
    {
        var t1 = 1 - t;
        return t1 * (t1 * (C1 + (C2 * 3 - C1) * t) + C3 * 3 * t * t) + C4 * t * t * t;
    }

    quad_curve(dt: number): IM.IVec2
    {
        const temp = 1 - dt;
        let x = ( temp * temp * this.start.x ) + ( 2 * temp * dt * this.mid.x ) + ( dt * dt * this.end.x )
        let y = ( temp * temp * this.start.y ) + ( 2 * temp * dt * this.mid.y ) + ( dt * dt * this.end.y )
        return { x: x, y: y }
    }

    bezier_curve(dt: number): IM.IVec2
    {

        
        let x = this.bezier(this.start.x, this.start.x, this.mid.x, this.end.x, dt)
        let y = this.bezier(this.start.y, this.start.y, this.mid.y, this.end.y, dt)
        
        return { x: x, y: y }
    }

    protected array_of_curves(length: number, callback: (dt: number) => IM.IVec2): IM.IVec2[]
    {
        length = numeric.to_int(length);
        let arr: IM.IVec2[] = [];
        if(length <= 0)
        {
            this.warn('The length must be greater than zero.');
            return arr;
        }

        for(let t = 0; t <= length; t ++)
        {
            arr.push(callback(t/length));
        }
        return arr;
    }

    array_bezier_curves(length: number): IM.IVec2[]
    {
        return this.array_of_curves(length, this.bezier_curve.bind(this))
    }

    array_quadratic_curves(length: number): IM.IVec2[]
    {
        return this.array_of_curves(length, this.quad_curve.bind(this))
    }
}
