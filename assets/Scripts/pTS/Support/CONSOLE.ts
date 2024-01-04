import {mark_singleton} from "./Decorators";
import {Instance} from "./Functions";
import {DefaultAssertOption, IAssertOption} from "./ISupport";


@mark_singleton
class CONSOLE
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
    }

    assert_null<T>(cond: T, option?: IAssertOption): asserts cond is NonNullable<T>
    {
        this.assert_is_true(!(cond === null || cond === undefined), option);
    }

    assert_array_index<T>(array: T[], index: number, option?: IAssertOption): void
    {
        this.assert_is_true(index >= 0 && index < array.length, { mode: option.mode, message: `The array's index at ${index} is out of range: [0 - ${array.length}]`});
    }
    
    asserts_null(option: IAssertOption, ...cond: any[])
    {
        for(const ret of cond)
        {
            this.assert_null(ret, option);
        }
    }

    asserts_array_index(array: any[], option: IAssertOption, ...index: number[])
    {
        for(const ret of index)
        {
            this.assert_array_index(array, ret, option);
        }
    }
}

export const csl = Instance(CONSOLE);
