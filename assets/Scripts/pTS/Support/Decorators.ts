import {FactoryManager} from "../Factory/FactoryManager"
import {Instance} from "./Functions"
import {js} from "./JS"

/**
 * @description
 * | Provide a decorator funciton to quick register this abstract class to the FactoryManager.
 *
 * @returns {function} The function to quick register this abstract class to the FactoryManager.
 */
export function fm_quick_reg(class_type: boolean = false) : ClassDecorator
{
    return function (target: any)
    {
        if(class_type) Instance(FactoryManager).register<ClassType<typeof target>>(js.get_class_name(target))
        else Instance(FactoryManager).register<typeof target>(js.get_class_name(target))
    }
}

/**
 * @description
 * | Provide a decorator funciton to quick register a class to a `Registered` FactoryManager.
 *
 * @param {string} abstract_parent The name of the abstract class which was registered in FactoryManager with its name.
 *
 * @returns {function} The function to quick registering this class to its Parent's FactoryManager.
 */
export function fm_quick_reg_to(abstract_parent: string): ClassDecorator
{
    return function (target: any)
    {
        Instance(FactoryManager).get(abstract_parent).register(js.get_class_name(target), target)
    }
}

/**
 * @description 
 * Provide a very fast way to make this class as a singleton class.
 *
 * @param {Function} target The contructor function
 *
 * @example
 * ```
 *
 * [@mark_singleton
 * export class TestSingleton
 * {
 *      protected _test_: number = 10;
 * }
 *
 * TestSingleton['instance']()          //< Get the singleton instance.
 *
 * Instance(TestSingleton)              //< Better way to get the singleton instance. Make sure imported the `Instance` function.
 *
 * ```
 */
export function mark_singleton(target: Function)
{
    target['_instance_'] = null;
    target['instance'] = function ()
    {
        //@ts-ignore
        if(!target['_instance_']) target['_instance_'] = new target();
        return target['_instance_']
    }
}

export function readonly(target: any, key: string, descriptor: PropertyDescriptor)
{
    descriptor.writable = false;
    return descriptor;
}

export function force_override(target: any, key: string, descriptor: PropertyDescriptor)
{
    descriptor.value = function ()
    {
        console.error(`The "${key}" method of ${target} must be overridden!!`);
        debugger;
    }

    return descriptor;
}


