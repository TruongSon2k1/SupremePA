import {mark_singleton} from "./Decorators"
import {Instance} from "./Functions";

       
@mark_singleton
class CONSTANTS
{
    /**
     *
     * @return {bool | string}
     */
    get aliases_tag(): symbol | string
    {
         return typeof Symbol === 'undefined' ? '__aliases' : Symbol('[[Aliases]]');
    }

    class_name_tag: '__classname__';

    class_id_tag: '__cid__';
}

export const constant: CONSTANTS = Instance(CONSTANTS);
