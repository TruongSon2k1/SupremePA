
export interface IBaseMasterClass 
{
    _name_: string; 

    log(...params: any[]): void;
    warn(...params: any[]): void;
    error(...params: any[]): void;

}
