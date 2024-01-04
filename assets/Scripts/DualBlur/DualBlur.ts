
const { ccclass, property, playOnFocus, executeInEditMode } = cc._decorator;

export interface IDualBlurOption
{
    offset: number;
    iteration: number;
    scale: number;
}

@ccclass('DualBlurOption')
export class DualBlurOption implements IDualBlurOption
{
    @property()
    offset: number = 5;

    @property()
    iteration: number = 3;

    @property()
    scale: number = 0.5;
}

@ccclass
@executeInEditMode
@playOnFocus
export class DualBlur extends cc.Component 
{
    @property(cc.SpriteFrame)
    source: cc.SpriteFrame = null;

    @property(DualBlurOption)
    option: DualBlurOption = new DualBlurOption();

    @property(cc.Material)
    materialDown: cc.Material = null;

    @property(cc.Material)
    materialUp: cc.Material = null;

    protected renderTexture: cc.RenderTexture = null;
    _sprite_dst_: cc.Sprite = null;

    @property(
        {
            visible()
            {
                return this.source && this.option && this.materialDown && this.materialUp
            }
        }
    )
    get generate() { return false; }
    set generate(value)
    {
        if(value) this.blur(this.option)
    }

    start() 
    {
        if(CC_EDITOR) return;
        this.blur(this.option);
    }

    /**
     * 模糊渲染
     * @param offset 模糊半径
     * @param iteration 模糊迭代次数
     * @param scale 降采样缩放比例
     */
    blur(option: IDualBlurOption)
    {
        const spriteDst = cc_support.component.get_component(this.node, cc.Sprite);
        spriteDst.spriteFrame = this.source;

        const material = this.materialDown;
        this.materialDown.setProperty('resolution', cc.v2(this.node.width, this.node.height));
        this.materialDown.setProperty('offset', option.offset);
        this.materialUp.setProperty('resolution', cc.v2(this.node.width, this.node.height));
        this.materialUp.setProperty('offset', option.offset);

        let srcRT = new cc.RenderTexture(),
        lastRT = new cc.RenderTexture();

        this.getRenderTexture(this.node, lastRT);

        let pyramid: [number, number][] = [], tw: number = lastRT.width, th: number = lastRT.height;
        //Downsample
        for (let i = 0; i < option.iteration; i++) {
            pyramid.push([tw, th]);
            [lastRT, srcRT] = [srcRT, lastRT];
            // 缩小截图尺寸，提高效率
            // 缩小尺寸时，RT会自动向下取整，导致黑边
            tw = Math.max(tw * option.scale, 1), th = Math.max(th * option.scale, 1);
            this.renderWithMaterial(srcRT, lastRT, this.materialDown, cc.size(tw, th));
        }
        // Upsample
        for (let i = option.iteration - 1; i >= 0; i--) {
            [lastRT, srcRT] = [srcRT, lastRT];
            this.renderWithMaterial(srcRT, lastRT, this.materialUp, cc.size(pyramid[i][0], pyramid[i][1]));
        }
        // 使用经过处理的 RenderTexture
        this.renderTexture = lastRT;
        spriteDst.spriteFrame = new cc.SpriteFrame(this.renderTexture);
        // 翻转纹理y轴
        spriteDst.spriteFrame.setFlipY(true);
        // 销毁不用的临时 RenderTexture
        srcRT.destroy();
    }

    /**
     * 获取节点的 RenderTexture
     * @param node 节点
     * @param out 输出
     * @see RenderUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/RenderUtil.ts
     */
    protected getRenderTexture(node: cc.Node, out?: cc.RenderTexture) {
        // 检查参数
        if (!cc.isValid(node)) {
            return null;
        }
        if (!out || !(out instanceof cc.RenderTexture)) {
            out = new cc.RenderTexture();
        }
        // 获取宽高
        const width = Math.floor(node.width),
            height = Math.floor(node.height);
        // 初始化 RenderTexture
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        out.initWithSize(width, height, cc.gfx.RB_FMT_S8);
        // 创建临时摄像机用于渲染目标节点
        const cameraNode = new cc.Node();
        cameraNode.parent = node;
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        camera.zoomRatio = 1 / node.scale;
        camera.zoomRatio = cc.winSize.height / height / node.scale;
        // 将节点渲染到 RenderTexture 中
        camera.targetTexture = out;
        camera.render(node);
        // 销毁临时对象
        cameraNode.destroy();
        // 返回 RenderTexture
        return out;
    }

    /**
     * 使用指定材质来将 RenderTexture 渲染到另一个 RenderTexture
     * @param srcRT 来源
     * @param dstRT 目标
     * @param material 材质
     * @param size RenderTexture尺寸缩放比例
     * @see RenderUtil.ts https://gitee.com/ifaswind/eazax-ccc/blob/master/utils/RenderUtil.ts
     */
    protected renderWithMaterial(srcRT: cc.RenderTexture, dstRT: cc.RenderTexture | cc.Material, material?: cc.Material, size?: cc.Size) {
        // 检查参数
        if (dstRT instanceof cc.Material) {
            material = dstRT;
            dstRT = new cc.RenderTexture();
        }
        // 创建临时节点（用于渲染 RenderTexture）
        const tempNode = new cc.Node();
        tempNode.setParent(cc.Canvas.instance.node);
        const tempSprite = tempNode.addComponent(cc.Sprite);
        tempSprite.sizeMode = cc.Sprite.SizeMode.RAW;
        tempSprite.trim = false;
        tempSprite.spriteFrame = new cc.SpriteFrame(srcRT);
        // 获取图像宽高
        const { width, height } = size ?? { width: srcRT.width, height: srcRT.height };
        // 初始化 RenderTexture
        // 如果截图内容中不包含 Mask 组件，可以不用传递第三个参数
        dstRT.initWithSize(width, height, cc.gfx.RB_FMT_S8);
        // 更新材质
        if (material instanceof cc.Material) {
            tempSprite.setMaterial(0, material);
        }
        // 创建临时摄像机（用于渲染临时节点）
        const cameraNode = new cc.Node();
        cameraNode.setParent(tempNode);
        const camera = cameraNode.addComponent(cc.Camera);
        camera.clearFlags |= cc.Camera.ClearFlags.COLOR;
        camera.backgroundColor = cc.color(0, 0, 0, 0);
        // 根据屏幕适配方案，决定摄像机缩放比
        // 还原sizeScale，zoomRatio取屏幕与RT宽高比
        camera.zoomRatio = cc.winSize.height / srcRT.height;
        // 将临时节点渲染到 RenderTexture 中
        camera.targetTexture = dstRT;
        camera.render(tempNode);
        // 销毁临时对象
        cameraNode.destroy();
        tempNode.destroy();
        // 返回 RenderTexture
        return dstRT;
    }

    protected onSliderOffsetEvent(sld: cc.Slider) {
        let offset = Math.round(sld.progress * 10 * 100) / 100;
        if (this.option.offset == offset)
            return;
        this.option.offset = offset;
        cc.log(`offset: ${this.option.offset}`);
        this.blur(this.option);
    }

    protected onSliderIterationEvent(sld: cc.Slider) {
        let iteration = Math.round(sld.progress * 5);
        if (this.option.iteration == iteration)
            return;
        this.option.iteration = iteration;
        cc.log(`iteration: ${this.option.iteration}`);
        this.blur(this.option);
    }

    protected onSliderScaleEvent(sld: cc.Slider) {
        let scale = Math.max(Math.round(sld.progress * 10) / 10, 0.1);
        if (this.option.scale == scale)
            return;
        this.option.scale = scale;
        cc.log(`scale: ${this.option.scale}`);
        this.blur(this.option);
    }

}
