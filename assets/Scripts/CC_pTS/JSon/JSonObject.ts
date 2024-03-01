import {IJSonData, IJSonObject} from "../Interface/IJSONData";

const {ccclass} = cc._decorator;

@ccclass('JSonObject')
export abstract class JSonObject implements IJSonObject
{

    to_json(): string 
    {
        let data = null;
        if(this.__to_json) data = this.__to_json();
        return `{"type": "${cc.js.getClassName(this)}", "data": ${data}}` //< IJSonData format
    }

    to_js_data(): IJSonData {
        return {
            type: cc.js.getClassName(this),
            data: this 
        }
    }

    init_from_data(data: IJSonData): void 
    {
        if(this.__init_from_json) this.__init_from_json(data);
    }

    protected __to_json?: () => string;
    protected __init_from_json?: (data: IJSonData) => void;
    
}
