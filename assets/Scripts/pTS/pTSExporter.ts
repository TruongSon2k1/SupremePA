//
//interface pTSCommon
//{
//    is_boolean(object: any): boolean;
//}
//
//interface NUMERIC
//{
//    tiny: number;
//    maximum: number;
//
//    /**
//     * @description
//     * | Convert boolean or string variable to number.
//     * | Return `0` caught error.
//     *
//     * @param {boolean | string} target The target need to be converted to number. 
//     *
//     * @returns {number} Converted number.
//     */
//    to_number(target: boolean | string): number;
//
//    to_int(number: number): number; 
//    
//    is_number(target: any): boolean;
//
//    /**
//     * @description
//     * | 
//     *
//     */
//    random_int(min: number, max: number): number
//
//    /**
//     * @description
//     * | 
//     *
//     */
//    random(min: number, max: number): number
//
//    /**
//     * @description
//     * | 
//     * 
//     */
//    uun(): number;
//
//    /**
//     * @description
//     * | 
//     *
//     */
//    float_rounding(num: number, rounding_num?: number): string;
//}
//
//interface pTSJs
//{
//    is_object(obj: any): boolean;
//
//    /**
//     * @description
//     * | Get the name of the object.
//     * | If the target is `{}` or `Object`. `""` will be return. 
//     *
//     * @borrows Modified from <a href="http://stackoverflow.com/questions/1249531/how-to-get-a-javascript-objects-class">the code from this stackoverflow post</a>
//     *
//     * @param {Object | Function} object Instance or constructor of the target object
//     *
//     * @returns {string} The name of the target object
//     */
//    get_class_name(object: Object | Function): string
//
//    /**
//     * @description
//     * |
//     *
//     * @returns 
//     */
//    get_super(constructor: Function): Function
//
//    /**
//     * @description
//     * | Checks whether the subclass is child of superclass or equals to superclass
//     *
//     * @param {constructor} subclass The constructor of the subclass.
//     * @param {constructor} superclass The constructor of the target class.
//     *
//     * @returns {boolean} True if it is, False otherwise
//     *
//     */
//    is_child_of(subclass: Function, superclass: Function): boolean;
//
//    get_templat_type<T>(ctor: ConstructClass<T>): string
//}
//
//interface IAssertOption
//{
//    mode?: AssertionMode;
//    message?: string;
//}
//
//interface pTSUtils
//{
//    methods_as_string(prototype: any): string[];
//
//    remove_contain_char(target: string[], char: string[]): string[];
//
//    /**
//     * @description
//     * | Resorting two elements inside the array.
//     *
//     * @deprecated Please use `utils.shift(...)` instead.
//     */
//    sort_two_in_array(array: any[], first_index: number, second_index: number, option?: IAssertOption): any[];
//
//    shift<T>(array: T[], first: number, second: number, ref?: T[], option?: IAssertOption): T[];
//    
//    only_contain_char(char: string, target: string[]): string[];
//    
//    must_contain<T>(ret: T, target: T[]): T[];
//
//    is_contain<T>(ret: T, target: T[]): boolean;
//
//    is_deep_contain<T, K>(checker: K, target: T[], property: string): boolean;
//
//    quick_find<T>(checker: T, arr: T[]): boolean
//    
//    clone<T>(target: T, ...binding: any[]): void
//}
//
//interface pTSConsole
//{
//    /**
//     * @description
//     * | Smart assert function.
//     *
//     * @param {unknown} cond Testing expression.
//     * @param {IAssertOption} option Optional debugger mode and message.
//     * @param {AssertionMode} [option.mode] Assertion mode, determine how the code will be broke after meeting error.
//     * @param {string} [option.message] Out put message if caught.
//     *
//     */
//    assert_is_true(cond: unknown, option?: IAssertOption): asserts cond ;
//    assert_null<T>(cond: T, option?: IAssertOption): asserts cond is NonNullable<T>
//
//    assert_array_index<T>(array: T[], index: number, option?: IAssertOption): void
//    
//    asserts_null(option: IAssertOption, ...cond: any[]): void
//
//    asserts_array_index(array: any[], option: IAssertOption, ...index: number[]): void
//}
//
//interface pTSContants
//{
//    /**
//     *
//     * @return {bool | string}
//     */
//    get aliases_tag(): symbol | string;
//
//    class_name_tag: string;
//
//    class_id_tag: string;
//}
//
//interface pTSString
//{
//    is_string(object: any): boolean;
//
//    uuid(prefix: string, suffix: string): string;
//
//    readable_time(): string;
//
//    smart_number(number: number): string;
//}
//
//interface pTSSupport
//{
//    common: pTSCommon;
//    numeric: NUMERIC;
//    str: pTSString;
//    js: pTSJs;
//    utils: pTSUtils;
//    console: pTSConsole
//    constant: pTSContants
//
//}
//
//interface pTSGlobal
//{
//    support: pTSSupport
//}
//
//
//export const _pTS_: pTSGlobal = {
//
//    support: {
//        numeric: null,
//        str: null,
//        js: null,
//        common: null,
//        console: null,
//        utils: null,
//        constant: null,
//    }
//}

