function round(num) {
  return Math.round(num * 10) / 10;
}

const CircleID = 
{
    START: 'sp',
    MID: 'mp',
    END: 'ep'
}

const jumper = 100;

function bezier_curve(s, m, e, dt)
{
    let x = Editor.Math.bezier(s.x, s.x, m.x, e.x, dt);
    let y = Editor.Math.bezier(s.y, s.y, m.y, e.y, dt);
    return cc.v2( x, y )
}

function array_bezier_curves(start, mid, end, length)
{
    length = Math.floor(length);

    let arr = [];

    if(length > 0)
    {
        for(let i = 0; i <= length; i ++)
        {
            arr.push(bezier_curve(start, mid, end, i/length))
        }
    }
    return arr;
}

class BezierDrawer extends Editor.Gizmo 
{
    init() 
    {
    }

    onCreateMoveCallbacks() 
    {
        let click_point = null;

        return {

            /**
             * @description
             * | Execute when the mouse is pressed on the gizmo.
             *
             * @param x {number} coordinate of pressed point 
             * @param y {number} coordinate of pressed point 
             * @param event {MouseEvent} mousedown dom event
             * @param The arguments parsed from registerMoveSvg`
             */
            start: (x, y, event, param) => 
            {
                y = this._view.offsetHeight - y;
                click_point = null;
                let position = cc.v2(x, y);
                position = Editor.GizmosUtils.snapPixelWihVec2(position);
                position = this._view.pixelToWorld(position);
                position = this.node.convertToNodeSpaceAR(position);

            },

            /**
             * @description
             * | Called when the mouse is on the gizmo.
             *
             * @param dx {number} coordinate of pressed point 
             * @param dy {number} coordinate of pressed point 
             * @param event {MouseEvent} mousedown dom event
             * @param The arguments parsed from registerMoveSvg`
             */
            update: (dx, dy, event, param) => 
            {

                const id = param.id;
                const ret = this.target[id]

                if(param.type === 'circle')
                {
                    const target = this.target;

                    const scaleX = target.node.scaleX;
                    const scaleY = target.node.scaleY;
                    const angle = target.node.angle * Math.PI / 180;
                    const cos_angle = Math.cos(angle);
                    const sin_angle = Math.sin(angle);
                    dx = dx / this._view.scale / scaleX;
                    dy = dy / this._view.scale / scaleY;
                    const dx_new = dx * cos_angle + dy * sin_angle;
                    const dy_new = -dx * sin_angle + dy * cos_angle;

                    if(!click_point) { click_point = ret.clone() }

                    ret.x = round(click_point.x + dx_new)
                    ret.y = round(click_point.y + dy_new)

                    this.target[id] = ret;
                }
            },

            /**
             * @description
             * | Execute when the mouse release the gizmo
             *
             * @param updated {boolean} Whether the mouse moved
             * @param event {MouseEvent} mousedown dom event
             * @param The arguments parsed from registerMoveSvg`
             */
            end: (updated, event, param) => 
            {
            }
        };
    }

    onCreateRoot() 
    {
        Editor.log("Created _root")
        this._tool = this._root.group();                                                //< Making `svg` tool

        const lines = [];                                                               //< Array of lines which draws the bezier curve.
        this._tool.select_node = this.node;

        /**
         * @description
         * | A function to create a svg circle.
         *
         * @param id {CircleID} The id of the color
         * 
         * @return circle
         */
        const get_circle = (id) =>
        {
            let color = 'rgba(255, 10, 10, 0.8)'
            if(id === CircleID.MID) color = 'rgba(100, 255, 100, 0.8)';
            let circle = this._tool.circle().fill( { color: color } )
                                            .style( 'pointer-events', 'fill' )
                                            .style( 'cursor', 'move' )

            this.registerMoveSvg(circle, circle, { cursor: 'move' })
            circle.id = id;
            return circle;
        }

        const obj = {}

        obj[CircleID.START] = get_circle(CircleID.START);        //< Asign a new variable `sp` to the `this._tool`
        obj[CircleID.MID] = get_circle(CircleID.MID);            //< Asign a new variable `mp` to the `this._tool`
        obj[CircleID.END] = get_circle(CircleID.END);            //< Asign a new variable `ep` to the `this._tool`

        /**
         * @description
         * | A function to create a svg line. 
         *
         * @param i {number} The index of the `lines` array.
         *
         * @returns line A svg line filled with color
         */
        const get_line = (i) =>
        {
            let line = lines[i];
            if(!line)
            {
                let color = 'rgba(200, 200, 200, 1)'
                lines[i] = line = this._tool.line().stroke( { color: color, width: 2 } )

                this.registerMoveSvg(line, line, { cursor: 'pointer', ignoreWhenHoverOther: true })
            }
            line.i = i;
            return line;
        }

        /**
         * @description
         * | A function to calculate the given coordinate(Vec2) to the Gizmo world axis.
         */
        const calculate = (p) =>
        {
            let node = this.node;
            let scaleX = node.scaleX;
            let scaleY = node.scaleY;
            let angle = -node.angle * Math.PI / 180;
            const cos_angle = Math.cos(angle);
            const sin_angle = Math.sin(angle);

            const v = Editor.GizmosUtils.snapPixelWihVec2(p.mul(this._view.scale));
            return cc.v2(
                (v.x * cos_angle * scaleX + v.y * sin_angle * scaleY),
                -(-v.x * sin_angle * scaleX + v.y * cos_angle * scaleY)
            );
        }

        /**
         * @param id {CircleID} The id of the `this._tool` that need to be center.
         * @param vec2 {cc.Vec2} The coordinates that need to be transformed to the Gizmo world axis to center the circle
         */
        this._tool.quick_pos = (id, vec2) =>
        {
            if(vec2 === undefined) return;
            const p = calculate(vec2);
            obj[id].center(p.x, p.y).radius(8 * this._view.scale)
        }

        this._tool.plot = (id, pos, vec2) =>
        {
            let target = this.target;
            let arr = array_bezier_curves(target[CircleID.START], target[CircleID.MID], target[CircleID.END], jumper)

            this._tool.move(pos.x, pos.y);
            obj[id].radius(0);
            lines.forEach(v => v.plot(0, 0, 0, 0))

            this._tool.quick_pos(id, vec2);

            for(let i = 0; i < arr.length; i++)
            {
                if(!!arr[i+1])
                {
                    const line = get_line(i);
                    const ret = arr[i];
                    const next = arr[i+1]

                    const s = calculate(ret);
                    const e = calculate(next);

                    line.plot(s.x, s.y, e.x, e.y);
                }
            }
        }
    }

    onUpdate() 
    {
        let target = this.target;
        let node = this.node;
        let pos = node.convertToWorldSpaceAR(cc.v2(0, 0));
        pos = this.worldToPixel(pos);
        pos = Editor.GizmosUtils.snapPixelWihVec2(pos);

        this._tool.plot(CircleID.START, pos, target.sp);
        this._tool.plot(CircleID.MID, pos, target.mp);
        this._tool.plot(CircleID.END, pos, target.ep);

    }
}

module.exports = BezierDrawer;
