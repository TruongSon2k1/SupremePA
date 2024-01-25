/// <reference path="IMath.ts" />

import {pTS} from "../Support/pTSupport";
import * as IM from "./IMath";

////@ts-ignore
//export namespace pTSMath 
//{
    export function is_fraction_like(target: any): target is IM.IFractionLike
    {
        return  (typeof target === 'object') &&
                ('numerator' in target && pTS.numeric.is_number(target.numerator)) &&
                ('denominator' in target && pTS.numeric.is_number(target.denominator)) ;
    }
    
    /**
     * @description 
     * | A class to define the Fraction
     * 
     * @link
     * https://github.com/pTSern/XMonopoly/tree/main/Classes/ZyUwU/math/ZYFraction.h
     * https://github.com/pTSern/XMonopoly/tree/main/Classes/ZyUwU/math/ZYFraction.cpp 
     * 
     * @author pTSern
     */
    export class Fraction implements IM.IFractionLike
    {
        _numerator_: number;                        //< The numerator of the fraction.
        _denominator_: number;                      //< The denominator of the fraction.
    
        private _log_: string = "";                 //< The log string.
    
        public set numerator(value: number) {this._numerator_ = value}
        public set denominator(value: number) 
        {
            if(value === 0)
            {
                this.warn("Can not set denominator to zero");
                this._denominator_ = 1;
                return;
            } 
            this._denominator_ = value;
        }
    
        public get numerator(): number { return this._numerator_}
        public get denominator(): number { return this._denominator_}
    
        public get decimal(): number 
        {
            return this._numerator_/this._denominator_;
        }
    
        /**
         * @private
         *
         * @description
         * | The constructor to create an ExpFraction.
         * 
         * @param {number} numerator The numerator of the fraction.
         * @param {number} denominator The denominator of the fraction.
         * 
         */
        private constructor(numerator: IM.IFractionLike | number , denominator?: number) 
        {
            this._log_ = "[" + pTS.js.get_class_name(this) + "]";
            
            if(pTS.numeric.is_number(numerator))
            {
                if(Number.isSafeInteger(numerator))
                {
                    //@ts-ignore
                    this.numerator = numerator;    
                    this.denominator = Math.round(denominator) ?? 1;
                }
                else
                {
                    if (denominator === 0 || denominator === 1) 
                    {
                        //@ts-ignore
                        const fraction = Fraction.create_from_decimal(numerator);
                        this.numerator = fraction.numerator;
                        this.denominator = fraction.denominator;
                    }
                    else 
                    {
                        //@ts-ignore
                        this.numerator = Math.round(numerator);
                        this.denominator = Math.round(denominator) ?? 1;
                    }
    
                }
            }
            else if(is_fraction_like(numerator))
            {
                //@ts-ignore
                this.numerator = Math.round(numerator.numerator);    
    
                //@ts-ignore
                this.denominator = Math.round(numerator.denominator);
            }
            else 
            {
                this.numerator = 1;
                this.denominator = 1;
            }
        }
    
        /**
         * @description
         * |
         */
        public static _max_decimal_length: number = 1000000;       
    
        /**
         * @description
         * | A static method to easily create a new fraction.
         * | 
         * | It can be return `ExpFraction.ONE` fraction if `denominator` is `0`.
         * | The fraction itself force the `numerator` and `denominator` to be the `Integer` type.
         * |
         * | Use `fraction(numerator, denominator, short_cut);` for shorter implements.
         *
         * @param {IFractionLike | number} numerator An object that implements from `IFractionLike` or look like `IFractionLike` or a number that representation for the `numerator` of the `Fraction`. If the `numerator` is `Float` type and the `denominator` below is equal to `1` or `0`, using this `numerator` as `decimal` value to turn to `Fraction`. See example.
         * @param {boolean | number} [denominator=1] Represent to the `short_cut` variable to do the `short cut` method if the `numerator` input above is `IFractionLike` type or it could be the number representation for the denominator of the fraction.
         * @param {boolean} [short_cut=true] Auto short-cut this fraction or not, if the `numerator` first input if `IFractionLike`, the `denominator` will representation this variable.
         * 
         * @returns A fraction. 
         * 
         * @example
         * ```
         * let f = Fraction.create(5, 10, true);    //< Use 2 `interger` number to create fraction, and do short-cut the fraction after.
         * let f = fraction(5, 10, true);           //< Using `fraction(...)` function.
         * f.to_string();                           //< The console should printf out: `1/2`.
         * 
         * let v = fraction(5, -10, false);         //< Use 2 `interger` number to create fraction, and not do short-cut the fraction after. 
         * v.to_string();                           //< The console should printf out: `-5/10`.
         * 
         * let z = fraction(1, 0);                  //< Invalid `denominator` (!= 0).
         * z.to_string();                           //< The console should printf out: `1/1`.
         * 
         * let x = fraction(1.25, 3.2);             //< Input 2 `float` number to create fraction. Convert two these number to interger and create a new fraction by using them.
         * x.to_string();                           //< The console should printf out: `1/3`.
         *
         * let k = fraction(1,25);                  //< Input float numerator and the default denominator equal to `1`, convert this `numerator` to fraction.
         * k.to_string();                           //< Out put should be: `1/4`
         * ```
         */
        public static create(numerator: IM.IFractionLike | number, denominator: boolean | number = 1, short_cut: boolean = true): Fraction
        {
            let ret: Fraction;
    
            if(is_fraction_like(numerator))
            {
                ret = new Fraction(numerator);
    
                if(!ret.is_valid()) return Fraction.ONE;
    
                //@ts-ignore
                if(common.is_boolean(denominator)) ret.short_cut(denominator);
                else ret.short_cut();
            }
            else 
            {
                //@ts-ignore
                let deno = common.is_boolean(denominator) ? numeric.to_number(denominator) : denominator;
    
                //@ts-ignore
                ret = new Fraction(numerator, deno);
    
                if(!ret.is_valid()) return Fraction.ONE;
    
                if(short_cut) ret.short_cut();
            }
    
            return ret;
        }
    
        /**
         * @public
         * @static
         *
         * @description
         * | 
         *
         * @param {number} decimal Decimal number that need to be converted to fraction.
         * @returns {IFractionLike} The Fraction converted from decimal.
         */
        public static create_from_decimal(decimal: number): IM.IFractionLike
        {
            let numerator = decimal * this._max_decimal_length;
            const denominator = this._max_decimal_length;
    
            const common_factor = pTS.math.gcd(numerator, denominator);
    
            numerator /= common_factor;
    
            const r = denominator / common_factor;
    
            return {numerator: numerator, denominator: r};
        }
    
        public static get ZERO()
        {
            let ret = new Fraction(0, 1);
            return ret;
        }
    
        public static get ONE()
        {
            let ret = new Fraction(1, 1);
            return ret;
        }
    
        /**
         *
         * @param func 
         * @param target 
         * @param targets 
         * @returns 
         */
        protected quick_math<T>(func: (target: T) => void, target: T, targets: T[]) 
        {
            func(target);
            for(const ret of targets)
            {
                func(ret);
            }
            return this;
        }
    
        public s_add(target: IM.IFractionLike, short_cut: boolean = true)    
        {
            let ret = Fraction.create(target, short_cut);
            this.quick_reduce_to_common_denominator(ret, short_cut);
    
            this.numerator = ret.numerator + this.numerator;
            if(short_cut) this.short_cut();
    
            this.auto_format();
            return this;
        }
    
        public add(target: IM.IFractionLike, ...targets: IM.IFractionLike[])
        {
            return this.quick_math(this.s_add.bind(this), target, targets);
        }
    
        public s_sub(target: IM.IFractionLike, short_cut: boolean = true)
        {
            let ret = Fraction.create(target, short_cut);
            this.quick_reduce_to_common_denominator(ret, short_cut);
    
            this.numerator = ret.numerator - this.numerator;
            if(short_cut) this.short_cut();
    
            this.auto_format();
            return this;
        }
    
        public sub(target: IM.IFractionLike, ...targets: IM.IFractionLike[])
        {
            return this.quick_math(this.s_sub.bind(this), target, targets);
        }
    
        public s_multiple(target: IM.IFractionLike, short_cut: boolean = true)
        {
            let ret = Fraction.create(target, short_cut);
            if(short_cut)
            {
                this.short_cut();
                ret.short_cut();
            }
    
            this.numerator = ret.numerator * this.numerator;
            this.denominator = ret.denominator * this.denominator;
    
            if(short_cut) this.short_cut();
    
            this.auto_format();
            return this;
        }
    
        public multiple(target: IM.IFractionLike, ...targets: IM.IFractionLike[])
        {
            return this.quick_math(this.s_multiple.bind(this), target, targets);
        }
    
        public s_divide(target: IM.IFractionLike, short_cut: boolean = true)
        {
            let ret = Fraction.create(target.denominator, target.numerator, short_cut);             //< Reverse target
            return this.s_multiple(ret, short_cut);
        }
    
        public divide(target: IM.IFractionLike, ...targets: IM.IFractionLike[])
        {
            return this.quick_math(this.s_divide.bind(this), target, targets);
        }
    
        public s_mul_num(target: number, short_cut: boolean = true)
        {
            return this.s_multiple(Fraction.create(target, 1), short_cut);
        }
    
        public mul_num(target: number, ...targets: number[])
        {
            return this.quick_math(this.s_mul_num.bind(this), target, targets)
        }
    
        public s_div_num(target: number, short_cut: boolean = true)
        {
            return this.s_divide(Fraction.create(target, 1), short_cut);
        }
    
        public div_num(target: number, ...targets: number[])
        {
            return this.quick_math(this.s_div_num.bind(this), target, targets)
        }
    
        public s_add_num(target: number, short_cut: boolean = true)
        {
            return this.s_add(Fraction.create(target, 1), short_cut);
        }
    
        public add_num(target: number, ...targets: number[])
        {
            return this.quick_math(this.s_add_num.bind(this), target, targets)
        }
    
        public s_sub_num(target: number, short_cut: boolean = true)
        {
            return this.s_sub(Fraction.create(target, 1), short_cut);
        }
    
        public sub_num(target: number, ...targets: number[])
        {
            return this.quick_math(this.s_sub_num.bind(this), target, targets)
        }
    
    /**
     * # SMART MATH FUNCTIONS
     */
    
        /**
         * @description
         * | Shortcut the fraction. Make its numerator and denominator smaller.
         * 
         * @example
         * ```
         * let f = ExpFraction.create(5, 10, false);
         * f.to_string(); // Console should printf out: `5/10`.
         * f.shot_cut();
         * f.to_string(); // Console should printf out: `1/2`.
         * ```
         */
        short_cut()
        {
            let n = Math.abs(this.numerator);
            let d = Math.abs(this.denominator);
    
            while(n != d)
            {
                if(n > d)
                {
                    n -= d;
                }
                else
                {
                    d -= n;
                }
            }
    
            this._numerator_ /= n;
            this._denominator_ /= d;
        }
    
        quick_reduce_to_common_denominator(target: Fraction, short_cut: boolean)
        {
            if(!target.is_valid()) return;
    
            if(short_cut)
            {
                this.short_cut();
                target.short_cut();
            }
    
            let lcm = pTS.math.lcm(this.denominator, target.denominator);
    
            this._numerator_ = (lcm / this.denominator) * this.numerator;
            this._denominator_ = lcm;
    
            target.numerator = (lcm / target.denominator) * target.numerator;
            target.denominator = lcm;
        }
    
        clone(short_cut: boolean = false)
        {
            let ret = Fraction.create(this.numerator, this.denominator, short_cut);
            return ret;
        }
    
        reverse(short_cut: boolean = false)
        {
            let ret = Fraction.create(this.denominator, this.numerator, short_cut);
            return ret;
        }
    
        /**
         * @description
         * | Auto check if the fraction is valid or not.
         * 
         * @returns False if the fraction is invalid (The `denominator` equal to `0`). True otherwise
         */
        is_valid()
        {
            if(this._denominator_ === 0)
            {
                this.error("The denominator can not be `0`.");
                return false;
            } 
    
            return true;
        }
    
        /**
         * @description 
         * | Auto formatting the fraction
         * 
         * | Convert fraction: `7 / (-10)` => `-7/10`.
         * 
         * @example
         * ```
         * let f = ExpFraction.create(7, -10);
         * f.auto_format(); // Actually, this method is allready called in side the `ExpFraction.create` method.
         * f.to_string(); // Console should printf out: `-7/10`
         * ```
         */
        auto_format()
        {
            if(this._numerator_ < 0 && this._denominator_ > 0) return;
            if(this._numerator_ > 0 && this._denominator_ > 0) return;
    
            this._denominator_ *= -1;
            this._numerator_ *= -1;
        }
    
        /**
         * @description
         * | Provide an easy method to exec warn log.
         * 
         * @param msg The warning message.
         */
        warn(...msg: any[])
        {
            console.warn(this._log_ + " Warn: ", msg);
        }
    
        /**
         * @description
         * | Provide an easy method to exec error log.
         * 
         * @param msg  The error message.
         */
        error(...msg: any[])
        {
            console.error(this._log_ + " Error: ", msg);
        }
    
        /**
         * @description
         * | Provide an easy method to log out message.
         * 
         * @param msg The log message.
         */
        log(...msg: any[])
        {
            console.log(this._log_ + " Log: ", msg);
        }
    
        /**
         * @description
         * | Return a string representation of the fraction.
         * 
         * @return string.
         */
        to_string(): string
        {
            let ret = this._numerator_ + " / " + this._denominator_;
            this.log(ret, this);
            return ret;
        }
    }
    
    
    /**
     * @description
     * | Jump to `Fraction.create(...)` for details information.
     * 
     */
    export function fraction(numerator: IM.IFractionLike | number, denominator: boolean | number = 1, short_cut: boolean = true): Fraction
    {
        return Fraction.create(numerator, denominator, short_cut);
    }
//}
