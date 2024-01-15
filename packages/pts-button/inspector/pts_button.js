
"use strict"

Vue.component('pts-button', {
    template: fs.readFileSync(Editor.url('packages://pts-button/inspector/pts_button.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        },
        multi: { type: Boolean }
    },
    methods: {
        T: Editor.T,
        resetNodeSize() 
        {
            const t = {id: this.target.uuid.value, path: "_resizeToTarget", type: "Boolean", isSubProp: !1, value: !0};
            Editor.Ipc.sendToPanel("scene", "scene:set-property", t);
        },

        _autoGrayEffectEnabled() 
        {
            return !(1 === this.target.transition.value || 2 === this.target.transition.value && this.target.disabledSprite.value.uuid);
        },

        _is_ready_for_resize: (t, n) => !!n || !t.value.uuid,

        _check_transition: (t, n, i) => i ? t.values.every(t => t === n) : t.value === n,
    },
})
