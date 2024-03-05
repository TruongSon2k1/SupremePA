
const {ccclass, property} = cc._decorator;

@ccclass
export class MA extends cc.Component {
    @property()
    ma: string  = ''
    @property()
    x: string = 'BRUH BRUH'
    ll()
    {
        console.log('MA', this.ma)
    }
}
