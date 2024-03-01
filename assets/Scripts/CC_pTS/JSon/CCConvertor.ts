import {IVec2, IVec3} from "../../pTS/Math/IMath";
import {IJSonData} from "../Interface/IJSONData";

export namespace cc_json_convertor
{
    export function node_to_json(target: cc.Node): string
    {
        return `{"type": "${cc.js.getClassName(target)}", "data": "${target.uuid}" }`
    }

    export function vec2_to_json(target: IVec2): string
    {

        return `{"type": "${cc.js.getClassName(target)}", "data": { "x": ${target.x}, "y": ${target.y}}}}`
    }

    export function vec3_to_json(target: IVec3): string
    {
        return `{"type": "${cc.js.getClassName(target)}", "data": { "x": ${target.x}, "y": ${target.y}, "z": ${target.z}}}` 
    }
}

export namespace cc_json_importor
{
    export function json_to_node(target: IJSonData): cc.Node
    {
        if(target.type != 'cc.Node') return null;
        //@ts-ignore
        return cc.engine.getInstanceById(target.data)
    }

    export function json_to_vec3(target: IJSonData): cc.Vec3
    {
        let x = target.data.x;
        let y = target.data.y;
        let z = target.data.z;

        const v3 = cc.v3(x, y, z)
        if(!v3) return cc.v3(0)
        return v3;
    }
}
