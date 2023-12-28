import {mark_cc_singleton} from "../CC_pTS/Support/CCDecorator";
import {Instance} from "../pTS/Support/Functions";
import {TEST2} from "./TEST2";

const {ccclass, property} = cc._decorator;

@ccclass
@mark_cc_singleton
export class TESTT extends cc.Component {
    protected onLoad(): void {
        Instance(TEST2).log("LM<AO")
    }
    @property()
    num: number = 0

    @property()
    str: string = ""
    log()
    {

    }
    
}

