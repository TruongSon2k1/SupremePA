
export interface IAssertOption
{
    mode?: AssertionMode;
    message?: string;
}

export const DefaultAssertOption: IAssertOption = {
    mode: 'crash',
    message: ''
}
