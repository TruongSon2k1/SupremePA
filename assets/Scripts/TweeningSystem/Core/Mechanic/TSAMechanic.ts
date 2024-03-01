import {IJSonData, IJSonObject} from "../../../CC_pTS/Interface/IJSONData";
import {cc_json_convertor, cc_json_importor} from "../../../CC_pTS/JSon/CCConvertor";
import {IQuickFactoryManager} from "../../../Interfaces/IQuickFactoryManager";
import {FactoryManager} from "../../../pTS/Factory/FactoryManager";
import {fm_quick_reg} from "../../../pTS/Support/Decorators";
import {Instance} from "../../../pTS/Support/Functions";
import {ITSMechanic} from "../../Component/ITweeningComponent";
import {TSRObject} from "../../Root/TSRObject";

const {ccclass, property} = cc._decorator;

@fm_quick_reg()
@ccclass('TSAMechanic')
export abstract class TSAMechanic extends TSRObject implements ITSMechanic
{

    @property(
        {
            tooltip: ""
        }
    )
    active: boolean = true;

    @property(
        {
            type: [cc.Node],
            tooltip: `- All other bounding target here.
                    \n- Make sure any of these target are not the 'Main' target of this TweeningComponent's Infomation
                    \n- These target will be called after this action is reached its condition.
                    \n- These target's tween will be run out side the main tween of this TweeningComponent's owner.
                    \n[WARNING] UNSAFE OPTION.`
        }
    )
    bounding_targets: cc.Node[] = []

    @property({type: undefined})
    optional: IJSonObject = null;

    @property()
    get time_cost() { return this.duration }

    abstract get duration(): number;

    public gter(action: cc.Tween<any>): cc.Tween<any>
    {
        if(!this.active) return action;
        for (const ret of this.bounding_targets) 
        {
            action.call(() => {this.generator(cc.tween(ret)).start()})
        }
        return this.generator(action)
    }

    protected abstract generator(action: cc.Tween<any>): cc.Tween<any>;

    public to_json(): string 
    {
        let js = ``;
        for(const ret of this.bounding_targets) js += ` ${cc_json_convertor.node_to_json(ret)},`
        js = js.slice(0, -1);

        let data = null;
        if(this.optional) data = this.optional.to_json();

        return `
        {
            "name": "${this._name_}",
            "active": ${JSON.stringify(this.active)},
            "bounding_targets": [ ${js} ],
            "optional": ${data}
        }
        `
    }


    public to_js_data(): IJSonData
    {
        const json: IJSonData = {
            type: cc.js.getClassName(this),
            data: this
        }

        return json;
    }

    init_from_data(data: IJSonData): void {
        const ret = data.data;
        this.active = ret.active;

        for(const ref of ret.bounding_targets) this.bounding_targets.push(cc_json_importor.json_to_node(ref)); //< Ref saved as IJSonData format, not Raw cc.Node

        this.optional.init_from_data(ret.optional)
    }

/// LIFE CYCLE ZONE ///////////////////////////////////////////////////////////////////////
    /**
     * @description
     * | Only run at Editor mode.
     * | Some Mechanic need this to alway resign the data to the pool.
     */
    e_updater(dt: number = 0): void {  }
    public destroy() {}
}

export const _TSQMecha_: IQuickFactoryManager = 
{
    string: "TSAMechanic",
    creator: Instance(FactoryManager).get<ClassType<TSAMechanic>>("TSAMechanic"),
    generator: function (id: string) 
    {
        const ret = Instance(FactoryManager).get<ClassType<TSAMechanic>>("TSAMechanic").generate(id)
        //@ts-ignore
        return new ret();
    }
}

