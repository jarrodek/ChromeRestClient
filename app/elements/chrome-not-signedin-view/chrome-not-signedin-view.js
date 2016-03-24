Polymer({
  is: 'chrome-not-signedin-view',

  close: function() {
    this.fire('cancel');
  },

  _learnMore: function() {
    window.open('https://github.com/jarrodek/ChromeRestClient/wiki/faq#signing-in-and-permissions');
  }
});
