'use strict';

module.exports = {
  load () {
    // execute when package loaded
  },

  unload () {
    // execute when package unloaded
  },

  // register your ipc messages here
  messages: {
      'open'() {
            Editor.Panel.open('node-data')
      },

      'sync_with_json'() {
            Editor.log("sync_with_json") 
          Editor.log("ASKJLFKALS", this, "")
      },

      'create_infor'(options, uuid)
      {
            const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
      }
  },
};
