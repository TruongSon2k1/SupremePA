/**
 * @des Like game_support, this class contains a lot of useful functions that help you lazier to code.
 * @des This class no need to import other things, so you can port this to any TS project.
 *
 * @author pTSern
 */
export const supporter =
{
    enable_log: true,
    _log: "[Supporter] Log: ",
    
    SmartRoundingNumber(target: number, roundingNum: number = 2)
    {
        return parseFloat(target.toFixed(roundingNum).replace(/\.?0+$/, ""))+ " / ";
    },

    /**
     * @param cond The TRUE condition. The message only throw if the OPPOSITE condition meet. Example you declare: supporter.Assert(true, "Im the message"); The Message only throw if 'true' is false.
     * @param message The message error that need to be throughout.
     * @param enableDebugger
     * @param data
     *
     * @note This will crash the game which force you to fix the error.
     */
    Assert(cond: boolean, message: string, enableDebugger: boolean = true, ...data: any[])
    {
        if(!cond)
        {
            console.error(message, ...data);
            if(enableDebugger)
            {
                debugger;
                return false;
            }
        }
        return true;
    },

    Warn(cond: boolean, ...message: any[])
    {
        if(!cond)
        {
            console.warn(message);
            return false;
        }
        return true;
    },

    /**
     * @param cond The TRUE condition. The message only throw if the OPPOSITE condition meet. Example you declare: supporter.BreakLog(true, "Im the message"); The Message only throw if 'true' is false.
     * @param message The message that need to be printed out to the console.
     *
     * @return True if the condition is true, false otherwise
     */
    BreakLog(cond: boolean, message: string)
    {
        if(!cond)
        {
            console.log(cond);
            return false;
        }
        return true;
    },

    /**
     * @des Generate uuid
     * @constructor
     */
    GenerateUUID(prefix: string = "")
    {
        return prefix + supporter.GenerateUN().toString();
    },

    GenerateUN()
    {
        const time_stamp = Date.now();

        const date = new Date(time_stamp);

        const year = date.getFullYear();
        const month = date.getMonth();
        const day = date.getDate();
        const hours = date.getHours();
        const minutes = date.getMinutes();
        const seconds = date.getSeconds();
        const mm = date.getMilliseconds();

        const ran = this.RandomInt(mm + seconds, year * 5017 + minutes * 5017);

        return ran
               + year * 1000
               + minutes * 10000000
               + seconds * 1000000000
               + mm * 100000000000
    },

    GetReadableCurrentTime()
    {
        const time_stamp = Date.now();

        const date = new Date(time_stamp);

        const year = date.getFullYear();
        const month = ("0" + date.getMonth() + 1).slice(-2);
        const day = ("0" + date.getDate()).slice(-2);
        const hours = ("0" + date.getHours()).slice(-2);
        const minutes = ("0" + date.getMinutes()).slice(-2);
        const seconds = ("0" + date.getSeconds()).slice(-2);
        const mm = ("0" + date.getMilliseconds()).slice(-2);

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}:${mm}`;
    },

    PerfectPercent(numerator: number, denominator: number, over_load: boolean = false)
    {
        this.Assert(denominator != 0, this._log + "The denominator can not be `0`.");
        let ret = Math.round(numerator / denominator * 100);
        if(!over_load)
        {
            if(ret >= 100) ret = 100;
        }
        return ret;
    },

    RandomInt(min: number, max: number)
    {
        min = Math.ceil(min);
        max = Math.floor(max);

        return Math.floor(Math.random() * (max - min + 1)) + min;
    },

    random(min: number, max: number)
    {
        return Math.random() * (max - min) + min;
    },

    log(...data: any[])
    {
        if(!this.enable_log) return;
        console.log(supporter.GetReadableCurrentTime() + '%c > ', 'background: #222; color: #bada55', ...data);
    },

    error(...data: any[])
    {
        console.error(supporter.GetReadableCurrentTime() + '%c > ', 'background: #222; color: #bada55', ...data);
        debugger;
    },

    warn(...data: any[])
    {
        console.warn('%c' + supporter.GetReadableCurrentTime() + ' >' , 'background: #0647c9; color:#1c1b18', ...data)
    },

    timer(func: Function, isLog: boolean, ...params: any[])
    {
        if(isLog)
        {
            supporter.log("Start running the function: [" + func.name + "] cost a certain time ...");
        }
        console.time();
        func.apply(null, params);
        console.timeEnd();
        if(isLog)
        {
            supporter.log("End running function...");
        }
    },

    getMethodsAsString(prototype: any): string[]
    {
        return Object.getOwnPropertyNames(prototype)
        .filter(p => typeof prototype[p] === 'function')
        //.map(func_name => prototype[func_name].toString());
    },

    removeContainChar(target: string[], char: string[]): string[]
    {
        const vamps = target.filter( ret =>
        {
            for(const temp of char)
            {
                if(ret.includes(temp)) return false;
            }
            return true;
        });
        return vamps;
    },
    smartNumer(number: number): string
    {
        return number.toLocaleString('en-US').replace(/,/g, '.');
    },
    sortTwoElementsInArray(array: any[], first_index: number, second_index): any[] 
    {
        const arr = [...array];

        if(first_index >= arr.length || second_index >= arr.length || first_index < 0 || second_index < 0)
        {
            this.warn("[Supporter] Log: The `first_index` and `second_index` must be smaller than the array length.")
            return arr;
        } 

        const temp = arr[first_index];
        arr[first_index] = arr[second_index];
        arr[second_index] = temp;

        return arr;
    },

    onlyContainChar(char: string, target: string[]): string[]
    {
        const vamps = target.filter( ret => 
            {
                for(const temp of char)
                {
                    if(ret.includes(temp)) return true;
                }
                return false;
            })
            return vamps;
    },

    mustContain<T>(ret: T, target: T[]): T[]
    {
        const vamps = target.filter( r =>
            {
                if(ret === r) return true;
                return false;
            })
            return vamps;
    },

    isContain<T>(ret: T, target: T[]): boolean
    {
        return this.mustContain(ret, target).length > 0;
    },

    is_deep_contain<T, K>(ret: K, target: T[], property: string): boolean
    {
        if(target.length <= 0) return true;
        if(typeof ret != typeof target[0][property]) return true;
        const vamps = target.filter( r =>
            {
                if(ret === r[property]) return true;
                return false;
            });
        return vamps.length > 0;
    },

    gcd(first: number, second: number)
    {
        return second === 0 ? first : this.gcd(second, first % second);
    },

    lcm(first: number, second: number)
    {
        return (first * second) / this.gcd(first, second);
    },

    quickFindArray<T>(ret: T, arr: T[])
    {
        for(const t of arr)
        {
            if(ret === t) return true;
        }
        return false;
    },

    clone<T>(target: T, ...binding: any[])
    {
        let temp = target.constructor;
        var cloner = new (temp.bind(target, ...binding));

        for(var att in target)
        {
            if(typeof target[att] === "object")
            {
                cloner[att] === supporter.clone(target[att], ...binding);
            }
            else 
            {
                cloner[att] = target[att];
            }
        }
        return cloner;
    },

    spread_clone<T>(target: T): T
    {
        let ret = {...target};
        return ret as T;
    },

    convert_to_world_rotation(target: cc.Node)
    {
        let v1 = target.convertToWorldSpaceAR(cc.v2(0, 0));
        let v2 = target.convertToWorldSpaceAR(cc.v2(200, 0));
        
        let sub = v2.subtract(v1);
        let uv = cc.v2(1000, 0);
        let ag = uv.signAngle(sub);
        return ag * 180/3.14;
    },

    /**
     * @description
     * | Rotate a node to the target position in world coodinate.
     *
     * @param target {cc.Node} The target node to apply this rotation function.
     * @param point {cc.Vec3} The target world coordinate to rotate to.
     *
     */
    rotate_to_point(target: cc.Node, point: cc.Vec3 | cc.Vec2)
    {
        const angle = this.angle_to_point(target, point);
        console.log(angle);
        target.angle += angle;
    },


    
    degree_to_rad(angle: number)
    {
        return angle * Math.PI / 180;
    },
    
    rad_to_degree(angle: number)
    {
        return angle * 180 / Math.PI;
    },

    max_min(value: number, target: number)
    {
        let v = target;
        if (target > value) v = value;
        else if (target < -value) v = -value;
        return v;
    },

    unique_element<T>(array: T[])
    {
        return Array.from(new Set(array));
    }

}
