Polymer({
  is: 'chrome-not-signedin-view',

  close: function() {
    this.fire('cancel');
  }
});
