
Polymer({
  is: 'drive-open-from-drive-ui',
  _back: function() {
    this.fire('restore-view');
  },

  _openDrive: function() {
    window.open('https://drive.google.com');
  }
});
