window.Polymer = window.Polymer || {};
window.Polymer.dom = 'shadow';
window.addEventListener('WebComponentsReady', function() {
  window.SocketFetchOptions.importUrl = '/bower_components/socket-fetch/%s';
  window.CodeMirror.modeURL = '/bower_components/codemirror/mode/%N/%N.js';
});
