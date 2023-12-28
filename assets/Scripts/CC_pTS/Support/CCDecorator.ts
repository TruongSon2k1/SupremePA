import {cc_support} from "./CCSupporter";

export function mark_cc_singleton(target: Function)
{
    target['_instance_'] = null;

    target['instance'] = function() 
    {
        if(!target['_instance_']) target['_instance_'] = cc_support.component.find_component(cc.director.getScene(), target.name)
        return target['_instance_']
    }

}
