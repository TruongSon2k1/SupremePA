
const {ccclass, property} = cc._decorator;

export interface IMB
{

    mb: number;
    lmao(): void;
}

@ccclass
export class MB extends cc.Component implements IMB {

    @property()
    mb: number = 0;
    lmao()
    {
        console.log("MB", this.mb)
    }
}
