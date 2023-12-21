import {FactoryManager} from "../Factory/FactoryManager"
import {sup} from "./Supporter"

/**
 * @description
 * | Provide a decorator funciton to quick register this abstract class to the FactoryManager.
 *
 * @returns {function} The function to quick register this abstract class to the FactoryManager.
 */
export function fm_quick_reg() : ClassDecorator
{
    return function (target: any)
    {
        FactoryManager.instance().register<typeof target>(sup.js.get_class_name(target))
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
        FactoryManager.instance().get(abstract_parent).register(sup.js.get_class_name(target), target)
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
