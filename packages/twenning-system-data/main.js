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
            Editor.Panel.open('ts-data')
      },

      'create_infor'(options, uuid)
      {
            const node = cc.engine.getInstanceById(this.$node_data._value);             //< Get node from uuid
      }
  },
};
