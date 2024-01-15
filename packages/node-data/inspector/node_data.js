"use strict"

Vue.component('node-data', {
    template: fs.readFileSync(Editor.url('packages://node-data/inspector/node_data.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },


    methods: {
        T: Editor.T,
        url: Editor.url('db://assets'),

        sync_data: function()
        {
            const ret = {
                    id: this.target.uuid.value,
                    path: "sync_data",
                    type: "Boolean",
                    isSubProp: false,
                    value: true
                };

            Editor.Ipc.sendToPanel("scene", "scene:set-property", ret);
        },
        
        save_data: function()
        {

            const ret = {
                    id: this.target.uuid.value,
                    path: "save_data",
                    type: "Boolean",
                    isSubProp: false,
                    value: true
                };

            Editor.Ipc.sendToPanel("scene", "scene:set-property", ret);
        },

        hover: function()
        {
            Editor.log("HOVERING") 
        },

        _ready_to_sync: function(infor)
        {
            return !!infor;
        },

        to_json: function()
        {
            Editor.log(Editor.url('db://assets'))
        },
        input_url: function(url)
        {

        }

    },
})

