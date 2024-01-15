
"use strict"

Vue.component('fast-component', {
    template: fs.readFileSync(Editor.url('packages://fast-component/inspector/fast_comp.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    methods: {
        T: Editor.T,
        do_test: function()
        {
            var ret = 
            {
                id: this.target.uuid.value,
                path: "test_this",
                type: "Boolean",
                value: true
            }
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', ret);
        }
    },
})
