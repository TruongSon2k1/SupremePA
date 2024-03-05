import {MB} from "./MB";
import {TestMixin} from "./TestMixin";

const {ccclass, property} = cc._decorator;

@ccclass
export class TestMX2 extends cc.Component {

    protected onLoad(): void {
        const mb = this.getComponent(TestMixin)
        mb && mb.lmao();
        console.log(mb.mb)
    }
}
