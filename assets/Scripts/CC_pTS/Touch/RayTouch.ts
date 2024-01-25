import {ClickEventHelper} from "../ExpertComponent/ClickEventHelper";

const {ccclass, property} = cc._decorator

@ccclass()
export abstract class RayTouch extends ClickEventHelper
{
    @property(
        {
            type: cc.Camera
        }
    )
    readonly camera: cc.Camera = null;

    _ray_: cc.geomUtils.Ray = new cc.geomUtils.Ray();

    onMouseDown(event: any): void { this.ray_test(event.touch); }
    onMouseMove(event: any): void { this.ray_test(event.touch); }

    ray_test(touch: cc.Touch)
    {
        this._ray_ = this.camera.getRay(touch.getLocation());

        const pm = cc.director.getPhysics3DManager();

        const rs = pm.raycast(this._ray_, 'default', 10000000, true);

        for(const ret of rs) this.ray_success(ret);
    }

    abstract ray_success(result: cc.PhysicsRayResult): void;
}
