import {cc_support} from "../CC_pTS/Support/CCSupporter";
import {pTS} from "../pTS/Support/pTSupport";

const {ccclass, property} = cc._decorator;

      interface Test
      {
            id: number;
            data: string;
      }

export interface TestX
{
    a: number;
    b: string;

    lmao(): void;
    _dark: () => void;
}

@ccclass
export class FindComps extends cc.Component implements TestX, Test
{
    id: number;
    data: string;

    lmao(): void {
    }
    @property()
    a: number = 0;
    @property()
    b: string = "";


    _dark: () => void = () => { console.log(`${this.uuid} >>>>>>> ${this.a} ${this.b} `)}

}

function krix(t: TestX)
{
    console.log(t.a)
}

