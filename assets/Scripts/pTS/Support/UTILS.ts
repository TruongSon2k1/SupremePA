import {csl} from "./CONSOLE";
import {mark_singleton} from "./Decorators";
import {Instance} from "./Functions";
import { IAssertOption, DefaultAssertOption } from "./ISupport";

@mark_singleton
class UTILS
{
    methods_as_string(prototype: any): string[]
    {
        return Object.getOwnPropertyNames(prototype).filter( p => typeof prototype[p] === 'function')
    }

    remove_contain_char(target: string[], char: string[]): string[]
    {
        const vamps = target.filter( ret =>
        {
            for(const temp of char)
            {
                if(ret.includes(temp)) return false; 
            }
            return true;
        });

        return vamps;
    }

    /**
     * @description
     * | Resorting two elements inside the array.
     *
     * @deprecated Please use `utils.shift(...)` instead.
     */
    sort_two_in_array(array: any[], first_index: number, second_index: number, option: IAssertOption = DefaultAssertOption): any[] 
    {
        const arr = [...array];

        csl.asserts_array_index(array, option, first_index, second_index);
        const temp = arr[first_index];
        arr[first_index] = arr[second_index];
        arr[second_index] = temp;

        return arr;
    }

    shift<T>(array: T[], first: number, second: number, ref?: T[], option: IAssertOption = DefaultAssertOption): T[] 
    {
        if(first === second) return array;

        csl.asserts_array_index(array, option, first, second);

        const temp = array[first];

        if(first < second)
        {
            for(let i = first + 1; i <= second; i++) array[i - 1] = array[i];
        }
        else 
        {
            for(let i = first; i !== second; i--) array[i] = array[i-1];
        }

        array[second] = temp;

        if(!!ref) ref = array;
        return array;
    }
    
    only_contain_char(char: string, target: string[]): string[]
    {
        const vamps = target.filter( ret => 
        {
            for(const temp of char)
            {
                if(ret.includes(temp)) return true;
            }
            return false;
        });

        return vamps;
    }
    
    must_contain<T>(ret: T, target: T[]): T[]
    {
        const vamps = target.filter( temp =>
        {
            if(temp === ret) return true;
            return false;
        })
        return vamps;
    }

    is_contain<T>(ret: T, target: T[]): boolean
    {
        return this.must_contain(ret, target).length > 0;
    }

    is_deep_contain<T, K>(checker: K, target: T[], property: string): boolean
    {
        if(target.length <= 0) return false;
        if(typeof checker != typeof target[0][property]) return false;

        const vamps = target.filter( ret =>
        {
            if (checker === ret[property]) return true;
            return false;
        });

        return vamps.length > 0;
    }

    quick_find<T>(checker: T, arr: T[])
    {
        for(const ret of arr)
        {
            if(checker === ret) return true;
        }

        return false;
    }
    
    clone<T>(target: T, ...binding: any[])
    {
        let temp = target.constructor;

        let cloner = new (temp.bind(target, ...binding));

        for(let att in target)
        {
            if(typeof target[att] === 'object') cloner[att] === this.clone(target[att], ...binding);
            else cloner[att] = target[att];
        }
    }
}

export const utils = Instance(UTILS)
