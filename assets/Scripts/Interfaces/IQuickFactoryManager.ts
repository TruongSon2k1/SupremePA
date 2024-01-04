import {BaseMasterFactory} from "../pTS/Factory/BaseMasterFactory";


export interface IQuickFactoryManager
{
    string: string;
    creator: BaseMasterFactory<any>,
    generator: (id: string) => any;
}
