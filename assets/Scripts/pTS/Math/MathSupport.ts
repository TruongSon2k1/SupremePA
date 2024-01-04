import {mark_singleton} from "../Support/Decorators";
import {Instance} from "../Support/Functions";


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
}

export const math = Instance(MathSupport);
