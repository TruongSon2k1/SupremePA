import {SchedulableObject} from "../CC_pTS/ExpertComponent/SchedulabelObject";
import {Fraction} from "../pTS/Math/Fraction";

const {ccclass, property} = cc._decorator;

@ccclass('TestScheduler')
export class TestScheduler extends SchedulableObject
{
    @property()
    interval: number = 0

    @property({type: cc.Integer})
    repeat: number = cc.macro.REPEAT_FOREVER;

    @property()
    delay: number = 0;

    settup()
    {
        this.schedule_once(this.test)
    }

    test()
    {
        console.log(this, "TEST")
    }

    update()
    {
        console.log(this, "UPDATING BY SCHEDULER")
    }
}

@ccclass
export class TEST2 extends cc.Component 
{
    @property(TestScheduler)
    x: TestScheduler = new TestScheduler()
    protected start(): void {
        const v = Fraction.create({numerator: 1, denominator: 2})
        console.log(v)
        this.x.settup()
    }
    
}


