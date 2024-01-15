
"use strict"

Editor.Panel.extend({
  // css style for panel
  style: `
    :host { margin: 5px; }
    h2 { color: #f90; }
  `,

  // html template for panel
    template: fs.readFileSync(Editor.url('packages://audio-manager/panel/index.html'), 'utf8'),

  // element and variable binding
  $: {
    btn: '#btn',
    label: '#label',
  },

  // method executed when template and styles are successfully loaded and initialized
  ready () {
    this.$btn.addEventListener('confirm', () => {
      Editor.Ipc.sendToMain('audio-manager:clicked');
    });
  },

  // register your ipc messages here
  messages: {
    'audio-manager:hello' (event) {
      this.$label.innerText = 'Hello!';
    }
  }
});
