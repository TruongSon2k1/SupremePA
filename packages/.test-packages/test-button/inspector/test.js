let fs = require('fs');

Vue.component('test-button', {
    template: fs.readFileSync(Editor.url('packages://test-button/inspector/test.html'), 'utf8'),

    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    methods: {
        on_button_click()
        {
            let time = new Date().getTime();
            Editor.Ipc.sendToPanel('scene', 'scene:set-property',
                {
                    id: this.target.uuid.value,
                    path: "but",
                    type: "Boolean",
                    value: true
                })
        }
    }
});
