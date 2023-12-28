let ActionEnum = cc.Enum({
    None: "None",
    Scale: "Scale",
    Blink: "Blink",
    Shake: "Shake",
    FadeIn: "FadeIn",
    FadeOut: "FadeOut",
    Move: "Move",
});

cc.Class({
    extends: cc.Component,
    editor: CC_EDITOR && {
        inspector: "packages://property-enum/inspector/dialog/dialog.js",
        playOnFocus: true,
        executeInEditMode: true,
    },
    properties: {
        actionType: {default: ActionEnum.None, displayName: "ActionType", type: ActionEnum},
        actionNode: {default: null, displayName: "ActionNode", type: cc.Node},
        preview: {
            default: 0, visible: true, notify() {
                this._record();
                this._runAction();
            }
        },

        delayTime: {default: 0, displayName: "DelayTime", tooltip: "second"},
        actionTime: {default: 0, displayName: "ActionTime", tooltip: "second"},

        shakeStrength: {default: 0, displayName: "ShakeLevel", tooltip: "ShakeLevel"},

        blinkCount: {default: 1, displayName: "BlinkNum", tooltip: "Blink times"},

        scaleSize: {default: 1, displayName: "ScaleRatio", tooltip: ""},


        moveBeganPosX: {default: 0, displayName: "X", tooltip: ""},
        moveBeganPosY: {default: 0, displayName: "Y", tooltip: ""},
        moveEndPosX: {default: 0, displayName: "X", tooltip: ""},
        moveEndPosY: {default: 0, displayName: "Y", tooltip: ""},

        _recordData: null,
    },

    onFocusInEditor: CC_EDITOR && function () {
        // console.log("onFocusInEditor");
    },
    onLostFocusInEditor: CC_EDITOR && function () {
        console.log("onLostFocusInEditor");
        this._recover();
        this._recordData = null;
    },

    _record: CC_EDITOR && function () {
        this._recordData = {
            x: this.node.x,
            y: this.node.y,
            opacity: this.node.opacity,
            active: this.node.active,
            scaleX: this.node.scaleX,
            scaleY: this.node.scaleY,
            rotation: this.node.rotation,
            width: this.node.width,
            height: this.node.height,
        };
    },

    _recover: CC_EDITOR && function () {
        this.node.stopAllActions();
        if (this._recordData) {
            this.node.x = this._recordData.x;
            this.node.y = this._recordData.y;
            this.node.opacity = this._recordData.opacity;
            this.node.active = this._recordData.active;
            this.node.scaleX = this._recordData.scaleX;
            this.node.scaleY = this._recordData.scaleY;
            this.node.rotation = this._recordData.rotation;
            this.node.width = this._recordData.width;
            this.node.height = this._recordData.height;
        }
    },
    onLoad() {


    },

    start() {
        if (!CC_EDITOR) {
            this._runAction();
        }
    },
    _runAction() {
        if (this.actionType === ActionEnum.None) {
            if (CC_EDITOR) {
                Editor.log("ActionType is none, can not preview!");
            }
            this._actionOver();
        } else {
            if (this.actionTime > 0) {
                let act = this._genAction(this.actionType);
                if (act) {
                    let actionArr = [];

                    if (this.delayTime > 0) {
                        actionArr.push(cc.delayTime(this.delayTime));
                    }

                    actionArr.push(act);
                    actionArr.push(cc.callFunc(this._actionOver.bind(this)));
                    let runAct = cc.sequence(actionArr);
                    this.node.stopAllActions();
                    this.node.runAction(runAct);
                }
            } else {
                console.log("the action time is 0,skip this action!");
            }
        }

    },
    _actionOver() {
        console.log("action over");
        if (CC_EDITOR) {
            this._recover && this._recover();
        }
    },
    _genAction(type) {
        let ret = null;
        if (type === ActionEnum.FadeOut) {
            this.node.opacity = 255;
            ret = cc.fadeOut(this.actionTime);
        } else if (type === ActionEnum.FadeIn) {
            this.node.opacity = 0;
            ret = cc.fadeIn(this.actionTime);
        } else if (type === ActionEnum.Shake) {
            let acts = [];
            let cfg = [
                {strength: 1, max: 10},
                {strength: 2, max: 12},
                {strength: 3, max: 15},
                {strength: 4, max: 20},
                {strength: 5, max: 25},
            ];

            let shakeMaxMoveDistance = 0;
            for (let i = 0; i < cfg.length; i++) {
                let item = cfg[i];
                if (item.strength.toString() === this.shakeStrength.toString()) {
                    shakeMaxMoveDistance = item.max;
                    break;
                }
            }
            let shakeCount = 0;
            let moveUnitTime = 0.05;
            shakeCount = Math.floor(this.actionTime / moveUnitTime);
            let node = this.node.getPosition();
            if (shakeCount > 0 && shakeMaxMoveDistance > 0) {
                for (let i = 0; i < shakeCount; i++) {
                    let x = node.x + this._randomPos(shakeMaxMoveDistance);
                    let y = node.y + this._randomPos(shakeMaxMoveDistance);
                    let move = cc.moveTo(moveUnitTime, cc.v2(x, y));
                    acts.push(move);
                }
                // acts.push(cc.callFunc(function () {
                //     this.node.x = this.node.y = 0;
                // }.bind(this)));
                ret = cc.sequence(acts);
            } else {
                console.log("can not find the config!");
            }
        } else if (type === ActionEnum.Blink) {
            ret = cc.blink(this.actionTime, this.blinkCount);
        } else if (type === ActionEnum.Scale) {
            ret = cc.scaleTo(this.actionTime, this.scaleSize);
        } else if (type === ActionEnum.Move) {
            this.node.setPosition(this.moveBeganPosX || 0, this.moveBeganPosY || 0);
            ret = cc.moveTo(this.actionTime, this.moveEndPosX || 0, this.moveEndPosY || 0);
        }
        return ret;
    },
    _randomByMaxValue(maxNum) {
        return Math.floor(Math.random() * maxNum);
    },
    _randomPos(max) {
        let num = this._randomByMaxValue(2);
        if (num % 2 === 0) {
            return this._randomByMaxValue(max)
        } else {
            return -this._randomByMaxValue(max);
        }
    }
});
