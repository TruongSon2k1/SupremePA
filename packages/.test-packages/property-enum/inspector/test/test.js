let packageName = "property-enum";
let fs = require("fire-fs");
let path = require('fire-path');


Vue.component('foobar-inspector', {
    template: fs.readFileSync(Editor.url('packages://' + packageName + '/inspector/test/test.html'), 'utf8'),

    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },
    methods: {
        onBtnClickTest() {
            this.target.foo.value += "123";
            Editor.log('foo:' + this.target.foo.value);
        },
        onBtnClickCheck() {
            Editor.log('check');
        },
    }
});