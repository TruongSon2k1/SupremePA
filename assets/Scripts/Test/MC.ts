const {ccclass, property} = cc._decorator;

export enum K
{
    A,
    B,
    C
}
@ccclass('MC')
export class MC{
    
    @property( {
        type: cc.Enum(K)
    } )
    _mc: K = K.A;
    @property( {
        type: cc.Enum(K)
    } )
    get mc() { return this._mc }
    //set mc(k: K) {
    //    this._mc = k;
    //}

    @property()
    x: number = 0;
    @property()
    get xx() { return this._x }
    
}
