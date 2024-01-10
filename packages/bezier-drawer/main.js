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
                const ret = this._tool[id]

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

                    if(!click_point) { click_point = ret.ref.clone() }

                    ret.ref.x = round(click_point.x + dx_new)
                    ret.ref.y = round(click_point.y + dy_new)

                    this.target[id] = ret.ref;

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
        this._tool = this._root.group();

        const lines = [];

        const get_circle = (id, ref) =>
        {
            let color = 'rgba(255, 10, 10, 0.8)'
            if(id === CircleID.MID) color = 'rgba(100, 255, 100, 0.8)';
            let circle = this._tool.circle().fill( { color: color } )
                                            .style( 'pointer-events', 'fill' )
                                            .style( 'cursor', 'move' )

            this.registerMoveSvg(circle, circle, { cursor: 'move' })
            circle.id = id;
            circle.ref = ref;
            return circle;
        }

        this._tool[CircleID.START] = get_circle(CircleID.START, this.target.sp);
        this._tool[CircleID.MID] = get_circle(CircleID.MID, this.target.mp);
        this._tool[CircleID.END] = get_circle(CircleID.END, this.target.ep);

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

        this._tool.plot = (id, pos, vec2) =>
        {
            let t = this._tool;
            let arr = array_bezier_curves(t[CircleID.START].ref, t[CircleID.MID].ref, t[CircleID.END].ref, jumper)

            this._tool.move(pos.x, pos.y);
            this._tool[id].radius(0);
            lines.forEach(v => v.plot(0, 0, 0, 0))

            const v = calculate(vec2);
            this._tool[id].center(v.x, v.y).radius(8 * this._view.scale)

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
