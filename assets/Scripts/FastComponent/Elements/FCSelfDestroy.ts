import {FastComponent} from "../Root/FastComponent";

const {ccclass, menu} = cc._decorator;

@ccclass
@menu('FastComponent/Common/Self Destroy')
export class FCSelfDestroy extends FastComponent
{
    reverse(): void {
    }
    protected get time_cost(): number 
    {
        return 0;
    }

    protected _mechanic(): void {
        this.node.destroy();
    }
}
