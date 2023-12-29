import {mark_cc_singleton} from "../CC_pTS/Support/CCDecorator";
import {TEST2} from "./TEST2";

const {ccclass, property} = cc._decorator;

@ccclass
export class TESTT extends cc.Component {
    @property(TEST2)
    t: TEST2
    protected onLoad(): void 
    {
    }
    @property()
    num: number = 0

    @property()
    str: string = ""
    log()
    {

    }
    
}

