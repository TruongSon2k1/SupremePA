import {constant} from "./CONSTANTS";
import {mark_singleton} from "./Decorators";
import {Instance} from "./Functions";


@mark_singleton
class JS
{
    is_object(obj: any)
    {
        return obj instanceof Object || typeof obj === 'object';
    }

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

            const tag = constant.class_name_tag;

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
        else if(object && object.constructor) return this.get_class_name(object.constructor)

        return '';
    }

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
    }

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
                subclass = this.get_super(subclass as Function);

                if(!subclass) return false;

                if(subclass === superclass) return true;
            }
        }

        return false;
    }

    get_templat_type<T>(ctor: ConstructClass<T>)
    {
        return typeof (new ctor())
    }
}

export const js: JS = Instance(JS)
