Polymer({
  is: 'chrome-not-signedin-view',

  properties: {
    // Set to open the dialog
    opened: Boolean
  },

  _learnMore: function() {
    window.open('https://github.com/jarrodek/ChromeRestClient/wiki/faq#signing-in-and-permissions');
  }
});
