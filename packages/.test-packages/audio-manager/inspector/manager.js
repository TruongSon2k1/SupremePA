
"use strict"

Vue.component('pts-button', {
    template: fs.readFileSync(Editor.url('packages://audio-manager/inspector/manager.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        },
        multi: { type: Boolean }
    },

    data()
    {
    },

    methods: {
        T: Editor.T,
        register: function() 
        {
            Editor.Ipc.sendToPanel('scene', 'scene:set-property',
                {
                    id: this.target.uuid.value,
                    path: "register",
                    type: "Boolean",
                    value: true
                })
        },

    },
})
