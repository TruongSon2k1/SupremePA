import {AntiDuplicateLevel, BaseMasterComponent} from "../CC_pTS/ExpertComponent/BaseMasterComponent";
import {GPM} from "./PackageManager";

const {ccclass, property, executeInEditMode} = cc._decorator;



enum FPSType
{
    SYSTEM,
    CUSTOM
}

@ccclass('FPSConfig')
class FPSConfig
{
    @property(
        {
            readonly: true
        }
    )
    name: string = "";

    @property(
        {
            type: cc.Enum(FPSType)
        }
    )
    type: FPSType = FPSType.SYSTEM;

    @property(
        {
            visible()
            {
                return this.type === FPSType.CUSTOM;
            }
        }
    )
    fps: number = 60;

    config()
    {
        if(this.type === FPSType.SYSTEM) return; 
        if(this.name === "ALL")
        {
            cc.game.setFrameRate(this.fps);
            return;
        }

        if(cc.sys.platform === this._mark_)
        {
            cc.game.setFrameRate(this.fps);
            console.log(`LOCK FRAME RATE AT: ${this.name}, SET TO ${this.fps}`)
        }
    }

    @property()
    _mark_: number = 0;

    static create(name: string, target_platform: number): FPSConfig
    {
        const ret = new FPSConfig();
        ret.name = name;
        ret._mark_ = target_platform;
        return ret;
    }

    static all()
    {
        const ret = new FPSConfig();
        ret.name = "ALL"
        ret._mark_ = cc.sys.platform;
        return ret;
    }
}
export const CONST_FPS_LIST: FPSConfig[] = [
    FPSConfig.create('WINDOWN', cc.sys.WIN32) ,
    FPSConfig.create('MACOS', cc.sys.MACOS  ),
    FPSConfig.create('LINUX', cc.sys.IPHONE ),
    FPSConfig.create('ANDROID',cc.sys.ANDROID ),
    FPSConfig.create('IOS', cc.sys.IPHONE ),
    FPSConfig.create('IPAD', cc.sys.IPAD ),
    FPSConfig.create('BLACK BERRY', cc.sys.BLACKBERRY ),
    FPSConfig.create('MOBILE BROWSER', cc.sys.MOBILE_BROWSER ),
    FPSConfig.create('DESKTOP BROWSER', cc.sys.DESKTOP_BROWSER ),
]

export const CONST_FPS_ALL: FPSConfig[] = [
    FPSConfig.all()
]

@ccclass('FPSDisplayer')
class FPSDisplayer
{
    static create(): FPSDisplayer
    {
        let ret = new FPSDisplayer();
        let node = new cc.Node('FPSCounter')
        ret.label = node.addComponent(cc.Label);
        ret.label.string = "FPS: 60"
        cc.director.getScene().addChild(node)
        const size = cc.director.getWinSize();
        node.setPosition(size.width/2, size.height/2)
        return ret;
    }

    @property(
        {
            type: cc.Label
        }
    )
    label: cc.Label = null;

    update()
    {
        if(!this.label) return;

        //this.label.string = "FPS: " + Math.round(1/cc.director.getDeltaTime()).toString();
        this.label.string = `FPS: ${cc.game.config.frameRate}`
    }

    destroy()
    {
        this.label.node.removeFromParent()
    }
}

enum FPSConfigManagerType
{
    NONE,
    ALL,
    CUSTOM
}

@ccclass('FPSConfigManager')
class FPSConfigManager
{
    @property()
    _enable_fps_counter_: boolean = false;
    @property()
    get enable_fps_counter() { return this._enable_fps_counter_ }
    set enable_fps_counter(value: boolean)
    {
        this._enable_fps_counter_ = value;
        if(value) this.fps_displayer = FPSDisplayer.create();
        else
            {
                this.fps_displayer.destroy()
                cc.js.clear(this.fps_displayer)
                this.fps_displayer = null;
            }
    }

    @property({type: FPSDisplayer, visible() { return this.fps_displayer }})
    fps_displayer: FPSDisplayer = null;

    @property({type: cc.Enum(FPSConfigManagerType)})
    _manager_: FPSConfigManagerType = FPSConfigManagerType.NONE

    @property({type: cc.Enum(FPSConfigManagerType)})
    get manager_type(): FPSConfigManagerType { return this._manager_ }
    set manager_type(value: FPSConfigManagerType)
    {
        if(value === this._manager_) return;
        this._manager_ = value;
        switch(value)
        {
            case FPSConfigManagerType.NONE:
                this._list_ = []
            return;
            case FPSConfigManagerType.ALL:
                this._list_ = CONST_FPS_ALL;
            return;
            case FPSConfigManagerType.CUSTOM:
                this._list_ = CONST_FPS_LIST;
            return;
        }
    }

    setup_list()
    {
        if(this._list_.length != CONST_FPS_LIST.length)
        {
            this._list_ = [];
            this._list_ = CONST_FPS_LIST;
        }
    }
    
    @property([FPSConfig]) 
    _list_: FPSConfig[] = [];
    @property(
        {
            type: [FPSConfig],
            visible() { return this.manager_type != FPSConfigManagerType.NONE }
        }
    ) 
    get list(): FPSConfig[] { return this._list_ }

    init()
    {
        if(this.enable_fps_counter && this.fps_displayer)
            {
                GameMaster.instance.schedule(() => {this.fps_displayer.update()})
        }

        if(this._manager_ != FPSConfigManagerType.NONE)
        {
            for(const ret of this._list_) ret.config();
        }
    }
}

@ccclass('GMConfiguration')
export class GMConfiguration
{
    @property()
    _time_scale_: number = 1;
    @property(
        {
            min: 0,
            step: 0.001,
            tooltip: `Rescale the delta-time, which will make the game run faster or slower.
                    \nDefault: 1`
        }
    )
    get time_scale() { return this._time_scale_ }
    set time_scale(value) { this._time_scale_ = value }
    @property(
        {
            type: FPSConfigManager
        }
    )
    fpg_config: FPSConfigManager = new FPSConfigManager();

    init()
    {
        this.fpg_config.init();
        cc.director.setTimeScale(this._time_scale_)
    }
}

@ccclass('Physics2DManager')
export class Physics2DManager
{
    physics_2d_manager!: cc.PhysicsManager;

    collider_manager: cc.CollisionManager ;

    @property(
        {
            displayName: "2D Physics Debug",
        }
    )
    enalbe_debug_2d_physic: boolean = false;

    @property(
        {
            displayName: "2D Collider Debug",
        }
    )
    enable_debug_2d_collider: boolean = false;

    init()
    {
        this.physics_2d_manager = cc.director.getPhysicsManager();
        //this.physics_2d_manager.enabledAccumulator = true
        this.collider_manager = cc.director.getCollisionManager();

        this.physics_2d_manager.enabled = true;
        this.collider_manager.enabled = true;

        if(this.enalbe_debug_2d_physic) 
        {
            this.physics_2d_manager.debugDrawFlags = cc.PhysicsManager.DrawBits['e_aabbBit'] |
                                                     cc.PhysicsManager.DrawBits['e_pairBit'] |
                                                     cc.PhysicsManager.DrawBits['e_centerOfMassBit'] |
                                                     cc.PhysicsManager.DrawBits['e_jointBit'] |
                                                     cc.PhysicsManager.DrawBits['e_shapeBit']
        }

       this.collider_manager.enabledDebugDraw = this.enable_debug_2d_collider; 
       this.collider_manager.enabledDrawBoundingBox = this.enable_debug_2d_collider; 
    }

}

@ccclass('Physics3DManager')
export class Physics3DManager
{
    physics_3d_manager!: cc.Physics3DManager;
    init()
    {
        this.physics_3d_manager = cc.director.getPhysics3DManager();
        this.physics_3d_manager.enabled = true;
    }
}

@ccclass('PhysicsManager')
export class PhysicsManager
{
    @property()
    _enable_2d_physic_: boolean = false;
   
    @property()
    get enable_2d_physic() { return this._enable_2d_physic_ }
    set enable_2d_physic(value: boolean) 
    {
        this._enable_2d_physic_ = value;

        if(value) { if(!this.physic_2d) this.physic_2d = new Physics2DManager(); }
        else this.physic_2d = null;
    }

    @property(
        {
            type: Physics2DManager,
            visible() { return this._enable_2d_physic_ }
        }
    )
    physic_2d: Physics2DManager = null;

    @property()
    _enable_3d_physic_: boolean = false;
    @property()
    get enable_3d_physic() { return this._enable_3d_physic_ }
    set enable_3d_physic(value: boolean) 
    {
        this._enable_3d_physic_ = value;

        if(value) { if(!this.physic_3d) this.physic_3d = new Physics3DManager() }
        else this.physic_3d = null;
    }

    @property(
        {
            type: Physics3DManager,
            visible() { return this._enable_3d_physic_ }
        }
    )
    physic_3d: Physics3DManager = null;

    init()
    {
        if(this.enable_2d_physic && this.physic_2d) this.physic_2d.init();
        if(this.enable_3d_physic && this.physic_3d) this.physic_3d.init();
    }
}

@ccclass
@executeInEditMode
export class GameMaster extends BaseMasterComponent 
{
    protected anti_duplicate: AntiDuplicateLevel = AntiDuplicateLevel.SINGLETON;

    public static instance: GameMaster

    @property(GMConfiguration)
    config: GMConfiguration = new GMConfiguration();

    @property(PhysicsManager)
    physic: PhysicsManager = new PhysicsManager();

    onLoad(): void 
    {
        super.onLoad();
        gm = GameMaster.instance = this;
        this.config.init();
        this.physic.init();
    }

    protected start(): void 
    {
    }

}

export let gm: Readonly<GameMaster> = null;
