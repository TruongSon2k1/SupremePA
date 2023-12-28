let packageName = "property-enum";
let fs = require("fire-fs");
let path = require('fire-path');

let ActionEnum = cc.Enum({
    None: "None",
    Scale: "Scale",
    Blink: "Blink",
    Shake: "Shake",
    FadeIn: "FadeIn",
    FadeOut: "FadeOut",
    Move: "Move",
});

Vue.component('dialog-inspector', {
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/inspector/dialog/dialog.html'), 'utf8'),

    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    created() {
        this.curAction = this.target.actionType.value;
    },
    data() {
        return {
            curAction: ActionEnum.None,
            actEnum: ActionEnum,
            actions: [
                {name: "None", option: ActionEnum.None},
                {name: "FadeIn", option: ActionEnum.FadeIn},
                {name: "FadeOut", option: ActionEnum.FadeOut},
                {name: "Shake", option: ActionEnum.Shake},
                {name: "Blink", option: ActionEnum.Blink},
                {name: "Scale", option: ActionEnum.Scale},
                {name: "Movement", option: ActionEnum.Move},
            ],

            actionTime: 1,
            delayTime: 0,


            shakeStrength: 1,
            blinkCount: 1,
            scaleSize: 1,

            moveBeganPos: cc.v2(0, 0),
            moveEndPos: cc.v2(0, 0),
        }

    },
    methods: {
        onBtnClickPreview() {
            let time = new Date().getTime();
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', {
                id: this.target.uuid.value,
                path: "preview",
                type: "Float",
                value: time,
            });
        },
        onChangeAction() {
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', {
                id: this.target.uuid.value,
                path: "actionType",
                type: "String",
                value: this.curAction,
            });
        },
        onSetActionShakeStrength() {
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', {
                id: this.target.uuid.value,
                path: "shakeStrength",
                type: "Float",
                value: parseFloat(this.target.shakeStrength.value.toString()),
            });
        },
        onBtnClickTest() {
            this.target.foo.value += "1";
            Editor.log('foo:' + this.target.foo.value);
        },
        onBtnClickCheck() {
            Editor.log('check');
        },
    }
});
