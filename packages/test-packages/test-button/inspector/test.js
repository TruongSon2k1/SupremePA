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
            Editor.Ipc.sendToPanel('scene', 'scene:set-property',
                {
                    id: this.target.uuid.value,
                    path: "num",
                    type: "Float",
                    value: parseFloat(this.target.num.value+=1) 
                })
            Editor.log("New num  : " + this.target.num.value)
        }
    }
});
