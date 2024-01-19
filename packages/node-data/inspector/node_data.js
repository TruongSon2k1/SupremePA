"use strict"

Vue.component('node-data', {
    template: fs.readFileSync(Editor.url('packages://node-data/inspector/node_data.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        },
    },

    data() {
        return {
            data_url: "",
            data: null,
            asset_data: null
        }

    },

    methods: {
        T: Editor.T,

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
            const ret = {
                    id: this.target.uuid.value,
                    path: "to_json",
                    type: "String",
                    isSubProp: false,
                    value: this.data_url
                };

            Editor.Ipc.sendToPanel("scene", "scene:set-property", ret);
        },

        from_json: function()
        {
            const ret = {
                    id: this.target.uuid.value,
                    path: "from_json",
                    type: "Boolean",
                    isSubProp: false,
                    value: true
                };

            Editor.Ipc.sendToPanel("scene", "scene:set-property", ret);
        },

        input_url: function()
        {
        },

        get_url: function()
        {
            this.data_url = this.quick_url(this.data)
        },

        quick_url: function(uuid)
        {
            if(uuid)
            {
                const str = Editor.url('db://assets/')
                const length = str.length + 1;
                let url = Editor.assetdb.remote._uuid2path[uuid].substring(length);
                return url;
            }
            return "";
        },

        get_sync_url: function()
        {

        },

        change_asset: function()
        {
            
        },

        uuid_2_json: function()
        {

            const ret = {
                    id: this.target.uuid.value,
                    path: "uuid2json",
                    type: "String",
                    isSubProp: false,
                    value: this.asset_data
                };

            Editor.Ipc.sendToPanel("scene", "scene:set-property", ret);
        }

    },
})

