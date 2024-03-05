
import {cc_support} from "../CC_pTS/Support/CCSupporter";
import {TestX} from "./FindComps";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ZZZZ extends cc.Component {

    protected onLoad(): void {
        const k: TestX = {
            a: 1,
            b: '',
            lmao: function () {},
            _dark: function (): void {
            }
        }

        const ret = cc_support.component.search_components<TestX>(this, k);

        for(const t of ret) {
            t._dark();
        }

        console.log(ret.length)
    }
}
