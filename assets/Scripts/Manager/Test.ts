import {g_vlt} from "./GameMaster";

const {ccclass, property} = cc._decorator;

@ccclass
export  class Test extends cc.Component {

    execute001()
    {
        g_vlt.time_scale = 0.05
    }
    execute2()
    {
        g_vlt.time_scale = 2
    }
}
