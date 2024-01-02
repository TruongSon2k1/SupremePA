import {mark_singleton} from "../Support/Decorators";


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

