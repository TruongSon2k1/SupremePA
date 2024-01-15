
"use strict"

Vue.component('tween_spector', {
    template: fs.readFileSync(Editor.url('packages://pts-tween/inspector/tween_spector.html'), 'utf8'),
    props: {
        target: {
            twoWay: true,
            type: Object,
        }
    },

    //data() 
    //{
    //    return {
    //        editor_mode: EditorMode.NONE, 
    //        target: EditorMode,
    //        targets: [
    //            {name: "NONE", option: EditorMode.NONE},
    //            {name: "CONDITION", option: EditorMode.CONDITION},
    //            {name: "MECHANIC", option: EditorMode.MECHANIC},
    //            {name: "BOTH", option: EditorMode.BOTH},
    //        ]
    //    }
    //    
    //},
    methods: {
        on_add_mechanic()
        {
            
        },
        on_change_action()
        {
            Editor.log("CHANGE")
        }
    },
})
