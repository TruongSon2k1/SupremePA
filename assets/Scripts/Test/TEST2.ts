import {mark_cc_singleton} from "../CC_pTS/Support/CCDecorator";

const {ccclass, property} = cc._decorator;

@ccclass
@mark_cc_singleton
export class TEST2 extends cc.Component {

    @property()
    num: number = 10
    protected onLoad(): void 
    {
        console.log(">>", this.num);
    }

    log(str: string)
    {
        console.log(this, str)
    }
}
