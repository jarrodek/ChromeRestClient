Polymer({
  is: 'saved-list-empty',

  openDrive: function() {
    this.fire('open-drive');
  },

  _computeA11yCommand: function(key) {
    var isMac = navigator.platform.indexOf('Mac') !== -1;
    var cmd = '';
    if (isMac) {
      cmd += 'meta+';
    } else {
      cmd += 'ctrl+';
    }
    cmd += key;
    return cmd;
  }
});
