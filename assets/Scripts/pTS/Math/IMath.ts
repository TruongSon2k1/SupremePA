
declare namespace pTSMath
{
    export interface IVec2
    {
        x: number;
        y: number;
    }

    export interface IVec3 extends IVec2
    {
        z: number;
    }

    export interface IFractionLike
    {
        numerator: number;                  //< The numerator of the fraction.
        denominator: number;                //< The denominator of the fraction.
    }
}

