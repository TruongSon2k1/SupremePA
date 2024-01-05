
//export namespace pTSMath
//{
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

    export const DefaultIVec2 = { x: 0, y: 0 }
    export const DefaultIVec3 = { x: 0, y: 0, z: 0 }
    export const DefaultIFractionLike = { numerator: 1, denominator: 1}
//}

