import {mark_singleton} from "../Support/Decorators";
import {Instance} from "../Support/Functions";
import {BezierCurves} from "./AxisFuntion";
import {IVec2} from "./IMath";


@mark_singleton
class MathSupport
{
    quad: BezierCurves = BezierCurves.zero();
    gcd(first: number, second: number)
    {
        return second === 0 ? first : this.gcd(second, first % second);
    }

    lcm(first: number, second: number)
    {
        return (first * second) / this.gcd(first, second);
    }

    berize_curve(start: IVec2, mid: IVec2, end: IVec2, length: number): IVec2[]
    {
        this.quad = BezierCurves.create(start, mid, end)
        return this.quad.array_bezier_curves(length);
    }

    quad_curve(start: IVec2, mid: IVec2, end: IVec2, length: number): IVec2[]
    {
        this.quad = BezierCurves.create(start, mid, end)
        return this.quad.array_quadratic_curves(length);
    }

}

export const math = Instance(MathSupport);
