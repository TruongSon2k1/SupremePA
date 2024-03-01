import {IDictionaryData} from "../../pTS/Collection/Dictionary";

export interface IJSonData
{
    type: string;
    data: any;
}

export interface IJSonDictionary<K> extends IJSonData
{
    type: string;
    data: IDictionaryData<K>;
}

export interface IJSonObject
{
    to_json(): string;
    to_js_data(): IJSonData;
    init_from_data(data: IJSonData): void;
}

