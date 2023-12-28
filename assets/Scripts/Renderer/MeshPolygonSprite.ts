import {BaseMasterComponent} from "../CC_pTS/ExpertComponent/BaseMasterComponent";

const gfx = cc.gfx;

const { ccclass, property, executeInEditMode, requireComponent, menu } = cc._decorator;

/**
 * @description 
 * | A class support editing a SpriteFrame by using Mesh.
 * 
 * @author lamyoung
 */
@ccclass
@executeInEditMode
@requireComponent(cc.MeshRenderer)
@menu("MeshTexture/MeshPolygonSprite")
export default class MeshPolygonSprite extends BaseMasterComponent 
{
    //# OFFSET
    @property 
    _offset_: cc.Vec2 = cc.v2(0, 0);                    //< Storage the offset for the mesh texture.
    /**
     * @description
     * | The offset of the mesh texture
     * 
     * @property _offset_
     * 
     * @type {cc.Vec2}
     */
    @property({ type: cc.Vec2, tooltip: 'The offset.' })
    get offset(): cc.Vec2 { return this._offset_; }
    set offset(value: cc.Vec2)
    {
        this._offset_ = value;
        this._updateMesh();
        this._applyVertexes();
    }

    @property
    _sprite_frame_: cc.SpriteFrame = null;              //< The main sprite frame to storage the image data.
    /**
     * @description
     * | The sprite frame that need to be edited.
     * 
     * @property _sprite_frame_
     * 
     * @type {cc.SpriteFrame}
     */
    @property({ type: cc.SpriteFrame, tooltip: 'The sprite-frame that needed to be edited.' })
    get spriteFrame(): cc.SpriteFrame { return this._sprite_frame_; }
    set spriteFrame(value: cc.SpriteFrame) 
    {
        this._sprite_frame_ = value;
        this._refreshAll();
    }

    @property
    _selecting_index_: number = 0;
    @property(
        {
            displayName: "The current select index.",
            readonly: true
        }
    )
    get selecting_index(): number { return this._selecting_index_; }
    set selecting_index(value) { this._selecting_index_ = value; }

    @property
    _remove_selecting_index_: boolean = false;
    @property(
        {
            displayName: "Remove Current Select Index."
        }
    )
    get confirm_remove(): boolean { return this._remove_selecting_index_; }
    set confirm_remove(value: boolean) 
    {
        this._remove_selecting_index_ = value;
        if(value)
        {
            this._remove_selecting_index_ = false;
            this._remove_action();
            this._resync_polygon();
            this._updateMesh();
            this._applyVertexes();
        }
    }
    _remove_action()
    {
        this.vertexes.splice(this.selecting_index, 1);
    }

    @property
    _add_polygon_: boolean = false;
    @property( { visible() {return !this.p_polygon; } } )
    get add_polygon(): boolean { return this._add_polygon_; }
    set add_polygon(value: boolean) 
    { 
        this._add_polygon_ = value;
        if(value)
        {
            this._add_polygon_ = false;

            this._add_polygon_func();
            this._resync_polygon();
        }
    }
    _add_polygon_func()
    {
        this._p_polygon_ = this.node.addComponent(cc.PhysicsPolygonCollider);
    }
    _resync_polygon()
    {
        if(!this.p_polygon) return;
        this._p_polygon_.points = []
        for(let i = 0; i < this._vertexes_.length; i++ )
        {
            this._p_polygon_.points[i] = this._vertexes_[i];
        }
    }

    @property
    _p_polygon_: cc.PhysicsPolygonCollider = null;
    get p_polygon(): cc.PhysicsPolygonCollider { this._p_polygon_ = this.node.getComponent(cc.PhysicsPolygonCollider); return this._p_polygon_; }


    //# VERTEXES
    @property
    _vertexes_: cc.Vec2[] = [cc.v2(0, 0), cc.v2(0, 100), cc.v2(100, 100), cc.v2(100, 0)]
    /**
     * @description
     * | The position vertexes
     * @property vertexes
     * @type {cc.Vec2}
     */
    @property({ type: cc.Vec2, tooltip: 'An array storage all the position of the vertex.' })
    get vertexes(): cc.Vec2[] { return this._vertexes_; }
    set vertexes(value) 
    {
        this._vertexes_ = value;
        this._resync_polygon();
        this._updateMesh();
        this._applyVertexes();
    }

    //# PRIVATE VARS

    private renderer: cc.MeshRenderer = null;
    private mesh: cc.Mesh = null;
    private _meshCache: { [key: number]: cc.Mesh } = {};

    //# ALL FUNCS 

    preException(): void 
    {

    }

    //> onLoad state()
    init() 
    {
        this._meshCache = {};
        const renderer = this.node.getComponent(cc.MeshRenderer) || this.node.addComponent(cc.MeshRenderer);

        renderer.mesh = null;
        this.renderer = renderer;

        let builtinMaterial = cc.Material.getBuiltinMaterial("unlit");//createWithBuiltin("unlit");
        renderer.setMaterial(0, builtinMaterial);
    }

    onEnable() 
    {
        this._refreshAll();
    }

    private _refreshAll() 
    {
        this._updateMesh();
        this._applySpriteFrame();
        this._applyVertexes();
    }

    private _updateMesh() 
    {
        let mesh = this._meshCache[this.vertexes.length];
        if (!mesh) {
            mesh = new cc.Mesh();
            mesh.init(new gfx.VertexFormat([
                { name: gfx.ATTR_POSITION, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
                { name: gfx.ATTR_UV0, type: gfx.ATTR_TYPE_FLOAT32, num: 2 },
            ]), this.vertexes.length, true);
            this._meshCache[this.vertexes.length] = mesh;
        }
        //this.quickLog("Mesh Native Url:", mesh.nativeUrl)
        this.mesh = mesh;
    }

    private _lerp(a: number, b: number, w: number) 
    {
        return a + w * (b - a);
    }

    /**
     * @description
     * | Update all the vertices of the mesh.
     * 
     * | This run every time the `_vertexes_` is changed.
     */
    private _applyVertexes() 
    {

        //> Set the coordinates of the mesh.
        const mesh = this.mesh;                       
        mesh.setVertices(gfx.ATTR_POSITION, this.vertexes);

        this._calculateUV();

        if (this.vertexes.length >= 3) 
        {
            //> Calculate the vertex index.
            const ids = [];

            //> Using `poly2tri` libs which supports simple polygon to ensure that vertices are in order and do not self-intersect. 
            const countor = this.vertexes.map((p) => { return { x: p.x, y: p.y } });
            const swctx = new poly2tri.SweepContext(countor, { cloneArrays: true });

            try 
            {
                swctx.triangulate();
                const triangles = swctx.getTriangles();
                triangles.forEach((tri) => 
                {
                    tri.getPoints().forEach(p => 
                        {
                        const i = countor.indexOf(p as any);
                        ids.push(i);
                    });
                })
            } catch (e) {
                this.log('poly2tri error', e);
            }

            if (ids.length === 0) 
            {
                this.log('Failing to calculate the vertex index.');
                ids.push(...this.vertexes.map((v, i) => { return i }));
            }
            mesh.setIndices(ids);
            
            this.renderer.mesh = mesh;
        }
    }

    private _calculateUV() 
    {
        const mesh = this.mesh;
        if (this.spriteFrame) 
        {
            const uv = this.spriteFrame.uv;
            const texture = this.spriteFrame.getTexture();
            /**
             *    t
             * l     r
             *    b
             */
            const uv_l = uv[0];
            const uv_r = uv[6];
            const uv_b = uv[3];
            const uv_t = uv[5];

            //> Calculate UV 
            const uvs = [];
            for (const pt of this.vertexes) 
            {
                const u = this._lerp(uv_l, uv_r, (pt.x + texture.width / 2 + this.offset.x) / texture.width);
                const v = this._lerp(uv_b, uv_t, (pt.y + texture.height / 2 - this.offset.y) / texture.height);
                uvs.push(cc.v2(u, v));
            }
            mesh.setVertices(gfx.ATTR_UV0, uvs);
        }
    }


    //> Update Sprite, This will be updated every time the `_vertexes_` variable is changed.
    private _applySpriteFrame() 
    {
        if (this.spriteFrame) {
            const renderer = this.renderer;
            let material = renderer.getMaterial(0);
            let texture = this.spriteFrame.getTexture();
            material.define("USE_DIFFUSE_TEXTURE", true);
            material.setProperty('diffuseTexture', texture);
        }
    }
}
