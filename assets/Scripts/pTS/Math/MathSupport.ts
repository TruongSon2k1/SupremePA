import {mark_singleton} from "../Support/Decorators";
import {Instance} from "../Support/Functions";
import {IBezier, axis_function} from "./AxisFuntion";
import {IVec2} from "./IMath";


@mark_singleton
class MathSupport
{
    gcd(first: number, second: number)
    {
        return second === 0 ? first : this.gcd(second, first % second);
    }

    lcm(first: number, second: number)
    {
        return (first * second) / this.gcd(first, second);
    }

    berize_curve(data: IBezier, length: number): IVec2[]
    {
        return axis_function.array_bezier_curves(data, length);
    }

    quad_curve(data: IBezier, length: number): IVec2[]
    {
        return axis_function.array_quadratic_curves(data, length);
    }

}

export const math = MathSupport;
