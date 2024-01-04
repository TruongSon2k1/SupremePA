import {common} from "./COMMON";
import {mark_singleton} from "./Decorators";
import {Instance} from "./Functions";
import {str} from "./STRING";

@mark_singleton
class NUMERIC
{
    tiny: 1.0e-10;
    maximum: 1.7976931348623157e+308;

    /**
     * @description
     * | Convert boolean or string variable to number.
     * | Return `0` caught error.
     *
     * @param {boolean | string} target The target need to be converted to number. 
     *
     * @returns {number} Converted number.
     */
    to_number(target: boolean | string): number
    {
        if(common.is_boolean(target)) return target ? 1 : 0;

        if(str.is_string(target)) return parseFloat(target as string);

        return 0;
    }

    to_int(number: number)
    {
        return number;
    }
    
    is_number(target: any): boolean
    {
        return typeof target === 'number' || target instanceof Number;
    }

    /**
     * @description
     * | 
     *
     */
    random_int(min: number, max: number): number
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    /**
     * @description
     * | 
     *
     */
    random(min: number, max: number)
    {
        return Math.random() * (max - min ) + min;
    }

    /**
     * @description
     * | 
     * 
     */
    uun(): number
    {
        const time_stamp = Date.now();

        const date = new Date(time_stamp);

        const year = date.getFullYear();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const mm = date.getMilliseconds();

        const ran = this.random_int(seconds + mm, year * 5017 + minutes * 5017);
        return ran
           + year * 1000
           + minutes * 10000000
           + seconds * 1000000000
           + mm * 100000000000
    }

    /**
     * @description
     * | 
     *
     */
    float_rounding(num: number, rounding_num: number = 2)
    {
        return parseFloat(num.toFixed(rounding_num).replace(/\.?0+$/, ""))+ " / ";
    }
}

export const numeric = Instance(NUMERIC)
