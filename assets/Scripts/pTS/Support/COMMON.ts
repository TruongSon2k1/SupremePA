import {mark_singleton} from "./Decorators";
import {Instance} from "./Functions";


@mark_singleton
class COMMON
{
    is_boolean(object: any): boolean
    {
        return typeof object === 'boolean' || object instanceof Boolean;
    }
}

export const common = Instance(COMMON);
