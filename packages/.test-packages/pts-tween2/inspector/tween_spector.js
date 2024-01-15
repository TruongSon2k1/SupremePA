
"use strict"

Vue.component('tween_spector', {
    template: fs.readFileSync(Editor.url('packages://pts-tween/inspector/tween_spector.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    data()
    {
        return 
        {
            details: "XXX"
        }
    },
    methods: {
        T: Editor.T,
        onChangeDetails: function()
        {
            Editor.Ipc.sendToPanel('scene', 'scene:set-property', {
                id: this.target.uuid.value,
                path: "information.details",
                type: "String",
                value: this.details,
            });
        },
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
