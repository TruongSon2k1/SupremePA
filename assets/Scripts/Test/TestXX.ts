import {TestX} from "./FindComps";

const {ccclass, property} = cc._decorator;

@ccclass
export class TestXX extends cc.Component implements TestX
{
    a: number = 1;
    b: string = 'x';
    lmao(): void {
    }
    _dark: () => void = () =>
    {
        console.log('TEST XX')
    };

}
