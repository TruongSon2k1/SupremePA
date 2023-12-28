const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component 
{

    onLoad () 
    {
        console.log(performance.now());
    }

}
