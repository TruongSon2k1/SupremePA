import {IDictionaryData} from "../../pTS/Collection/Dictionary";


export interface IJSonData
{
    type: string;
    data: object;
}

export interface IJSonDictionary<K> extends IJSonData
{
    type: string;
    data: IDictionaryData<K>;
}
