import {IJSonData} from "../../CC_pTS/Interface/IJSONData";
import {cc_json_importor} from "../../CC_pTS/JSon/CCConvertor";
import {ITSConditionEditor, ITSConditionPreviewObject, ITSEditorManager, ITSInformator, ITSMechanicEditor, ITSMechanicPreviewObject, ITweeningComponent} from "../Component/ITweeningComponent";

export function ts_to_json(ts: ITweeningComponent): string
{
    return `{ "type": ${JSON.stringify(cc.js.getClassName(ts))}, "data": {"information": ${ts.information.to_json()}, "editor": ${ts.editor.to_json()} } }`
}

export function information_json(infor: ITSInformator): string
{
    return JSON.stringify(infor.to_js_data(), information_json_paser)
}

export function information_from_json(data: IJSonData): ITSInformator 
{
    const ret = data.data;
    return {
        details: ret.details,
        main: cc_json_importor.json_to_node(ret.main),
        silent_backend: ret.silent_backend,
        conditon_type: ret.conditon_type,
        reset_type: ret.reset_type,
        mechanic_execution_mode: ret.mechanic_execution_mode,

        to_json: function (): string {return ``},
        to_js_data: function (): IJSonData { return null },
        init_from_data: function (): void {}
    }
}

export function editor_json(editor: ITSEditorManager): string
{
    return `{"type": "${cc.js.getClassName(editor)}", "data": { "editor_mode": ${JSON.stringify(editor.editor_mode)}, "condition": ${condition_editor_json(editor.condition)}, "mechanic": ${mechanic_editor_json(editor.mechanic)} }}`
}

export function editor_from_json(data: IJSonData): ITSEditorManager
{
    const ret = data.data;
    return {
        editor_mode: ret.editor_mode,
        condition: condition_editor_from_json(ret.condition),
        mechanic: mechanic_editor_from_json(ret.mechanic),

        to_json: function (): string {return ``},
        to_js_data: function (): IJSonData { return null },
        init_from_data: function (): void {}
    }
}

function condition_editor_json(condition: ITSConditionEditor): string
{
    return `{"type": "${cc.js.getClassName(condition)}", "data": { "view_mode": ${JSON.stringify(condition.view_mode)}, "type": "${cc.js.getClassName(condition.list[0])}", "list": [ ${array_pv_json(condition.list)} ] } }`
}

function condition_editor_from_json(data: IJSonData): ITSConditionEditor
{
    const ret = data.data;
    return {
        view_mode: ret.view_mode,
        list: array_data_from_json({ type: ret.type, data: ret.list }),

        init_with_data() {}
    }
}

function mechanic_editor_from_json(data: IJSonData): ITSMechanicEditor
{
    const ret = data.data;
    return {
        view_mode: ret.view_mode,
        list: array_data_from_json({type: ret.type, data: ret.list}),

        init_with_data() {}
    }
}


export function array_pv_json(arr: ITSConditionPreviewObject[] | ITSMechanicPreviewObject[]): string
{
    let js = ``
    for(const ret of arr) js += `{ "action": ${ret.to_json()}, "index": ${ret.index} },`
    return js.slice(0, -1)
}

export function array_data_from_json(data: IJSonData): any[]
{
    let ret = []
    let arr = data.data;

    for(const ref of arr)
    {
        ret.push(ref)
    }

    return ret;
}


function mechanic_editor_json(mechanic: ITSMechanicEditor): string
{
    return `{"type": "${cc.js.getClassName(mechanic)}", "data": { "view_mode": ${JSON.stringify(mechanic.view_mode)}, "type": "${cc.js.getClassName(mechanic.list[0])}", "list": [ ${array_pv_json(mechanic.list)} ]} }`
}

function information_json_paser(key: string, value: any): any | IJSonData
{
    if(key == 'main') return { type: cc.js.getClassName(value), data: value.uuid}
    return value;
}
