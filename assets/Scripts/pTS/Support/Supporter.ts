
export type AssertionMode = 'crash' | 'break' | 'warn';

export interface IAssertOption
{
    mode?: AssertionMode;
    message?: string;
}

export const DefaultAssertOption: IAssertOption = {
    mode: 'crash',
    message: ''
}

export const sup =
{
    config:
    {
        aliases_tag: typeof Symbol === 'undefined' ? '__aliases' : Symbol('[[Aliases]]'),
        class_name_tag: '__classname__',
        class_id_tag: '__cid__'
    },

    console:
    {

        /**
         * @description
         * | Smart assert function.
         *
         * @param {unknown} cond Testing expression.
         * @param {IAssertOption} option Optional debugger mode and message.
         * @param {AssertionMode} [option.mode] Assertion mode, determine how the code will be broke after meeting error.
         * @param {string} [option.message] Out put message if caught.
         *
         */
        assert_is_true(cond: unknown, option: IAssertOption = DefaultAssertOption): asserts cond 
        {
            if(!cond)
            {
                const msg = `Assertion failed: ${option.message ?? '[no-message]'}`;
                switch(option.mode)
                {
                    case "crash":
                        throw new Error(msg);
                    case "break":
                        console.warn(msg);
                        debugger;        
                        return;
                    case "warn":
                        console.warn(msg);
                        return;
                }
            }
        },

        assert_null<T>(cond: T, option?: IAssertOption): asserts cond is NonNullable<T>
        {
            this.assert_is_true(!(cond === null || cond === undefined), option);
        },

        assert_array_index<T>(array: T[], index: number, option?: IAssertOption): void
        {
            this.assert_is_true(index >= 0 && index < array.length, { mode: option.mode, message: `The array's index at ${index} is out of range: [0 - ${array.length}]`});
        },
        
        asserts_null(option: IAssertOption, ...cond: any[])
        {
            for(const ret of cond)
            {
                this.assert_null(ret, option);
            }
        },

        asserts_array_index(array: any[], option: IAssertOption, ...index: number[])
        {
            for(const ret of index)
            {
                this.assert_array_index(array, option, ret);
            }
        }
    },

    number:
    {
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
            if(sup.other.is_boolean(target)) return target ? 1 : 0;

            //@ts-ignore
            if(sup.string.is_string(target)) return parseFloat(target);

            return 0;
        },

        to_int(number: number)
        {
            return number;
        },
        
        is_number(target: any): boolean
        {
            return typeof target === 'number' || target instanceof Number;
        },

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
        },

        /**
         * @description
         * | 
         *
         */
        random(min: number, max: number)
        {
            return Math.random() * (max - min ) + min;
        },

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
        },

        /**
         * @description
         * | 
         *
         */
        float_rounding(num: number, rounding_num: number = 2)
        {
            return parseFloat(num.toFixed(rounding_num).replace(/\.?0+$/, ""))+ " / ";
        }
    },

    string: 
    {
        is_string(object: any)
        {
            return typeof object === 'string' || object instanceof String;
        },

        uuid(prefix: string = "", suffix: string = ""): string
        {
            return prefix + sup.number.uun().toString() + suffix;   
        },

        readable_time(): string
        {
            const time_stamp = Date.now();

            const date = new Date(time_stamp);

            const year = date.getFullYear();
            const month = ("0" + date.getMonth() + 1).slice(-2);
            const day = ("0" + date.getDate()).slice(-2);
            const hours = ("0" + date.getHours()).slice(-2);
            const minutes = ("0" + date.getMinutes()).slice(-2);
            const seconds = ("0" + date.getSeconds()).slice(-2);
            const mm = ("0" + date.getMilliseconds()).slice(-2);

            return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${mm}`;
        },

        smart_number(number: number): string
        {
            return number.toLocaleString('en-US').replace(/,/g,'.')
        }
    },

    utils: 
    {
        methods_as_string(prototype: any): string[]
        {
            return Object.getOwnPropertyNames(prototype).filter( p => typeof prototype[p] === 'function')
        },

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
        },

        ///**
        // * @description
        // * | Resorting two elements inside the array.
        // *
        // * @deprecated Please use `sup.utils.shift(...)` instead.
        // */
        //sort_two_in_array(array: any[], first_index: number, second_index: number, option: IAssertOption = sup.console.default_option): any[] 
        //{
        //    const arr = [...array];

        //    sup.console.asserts_array_index(array, option, first_index, second_index);
        //    const temp = arr[first_index];
        //    arr[first_index] = arr[second_index];
        //    arr[second_index] = temp;

        //    return arr;
        //},

        //shift<T>(array: T[], first: number, second: number, ref?: T[], option: IAssertOption = sup.console.default_option): T[] 
        //{
        //    if(first === second) return array;

        //    sup.console.asserts_array_index(array, option, first, second);

        //    const temp = array[first];

        //    if(first < second)
        //    {
        //        for(let i = first + 1; i <= second; i++) array[i - 1] = array[i];
        //    }
        //    else 
        //    {
        //        for(let i = first; i !== second; i--) array[i] = array[i-1];
        //    }

        //    array[second] = temp;

        //    if(!!ref) ref = array;
        //    return array;
        //},
        
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
        },
        
        must_contain<T>(ret: T, target: T[]): T[]
        {
            const vamps = target.filter( temp =>
            {
                if(temp === ret) return true;
                return false;
            })
            return vamps;
        },

        is_contain<T>(ret: T, target: T[]): boolean
        {
            return this.must_contain(ret, target).length > 0;
        },

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
        },

        quick_find<T>(checker: T, arr: T[])
        {
            for(const ret of arr)
            {
                if(checker === ret) return true;
            }

            return false;
        },
        
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
    },

    math:
    {
        gcd(first: number, second: number)
        {
            return second === 0 ? first : this.gcd(second, first % second);
        },

        lcm(first: number, second: number)
        {
            return (first * second) / this.gcd(first, second);
        }
    },
    
    /**
     * @description
     * | A support library based on js-typed.
     */
    js:
    {
        /**
         * @description
         * | Get the name of the object.
         * | If the target is `{}` or `Object`. `""` will be return. 
         *
         * @borrows Modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>
         *
         * @param {Object | Function} object Instance or constructor of the target object
         *
         * @returns {string} The name of the target object
         */
        get_class_name(object: Object | Function): string
        {
            if(typeof object === 'function')
            {
                const prototype = object.prototype;
                const tag = sup.config.class_name_tag;
                if(prototype && prototype.hasOwnProperty(tag) && prototype[tag])
                {
                    return prototype[tag];
                }

                let ret: string = "";

                if(object.name) { ret = object.name }

                if(object.toString)
                {
                    let arr: any;
                    const str = object.toString();

                    if(str.charAt(0) === '[') arr = str.match(/\[\w+\s*(\w+)\]/);                     
                    else arr = str.match(/function\s*(\w+)/);
 
                    if(arr && arr.length === 2) ret = arr[1];
                }

                return ret != 'Object' ? ret : "";
            }
            else if(object && object.constructor) return sup.js.get_class_name(object.constructor)

            return '';
        },

        /**
         * @description
         * |
         *
         * @returns 
         */
        get_super(constructor: Function)
        {
            const prototype = constructor.prototype;
            const dunder_prototype = prototype && Object.getPrototypeOf(prototype);

            return dunder_prototype && dunder_prototype.constructor;
        },

        /**
         * @description
         * | Checks whether the subclass is child of superclass or equals to superclass
         *
         * @param {constructor} subclass The constructor of the subclass.
         * @param {constructor} superclass The constructor of the target class.
         *
         * @returns {boolean} True if it is, False otherwise
         *
         */
        is_child_of(subclass: Function, superclass: Function): boolean
        {
            if(subclass && superclass)
            {
                if(typeof subclass !== 'function') return false;
                if(typeof superclass !== 'function') return false;

                if(subclass === superclass) return true;

                while(true)
                {
                    subclass = sup.js.get_super(subclass as Function);

                    if(!subclass) return false;

                    if(subclass === superclass) return true;
                }
            }

            return false;
        }
    },

    other:
    {
        is_boolean(object: any): boolean
        {
            return typeof object === 'boolean' || object instanceof Boolean;
        }
    }
}

export const sp_n = sup.number;
export const sp_u = sup.utils;
export const sp_o = sup.other;
export const sp_s = sup.string;
export const sp_m = sup.math;
export const sp_c = sup.console;
export const sp_j = sup.js;
export const cfg = sup.config;

