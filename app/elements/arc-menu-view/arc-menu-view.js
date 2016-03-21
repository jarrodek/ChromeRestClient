(function() {
Polymer({
  is: 'arc-menu-view',

  properties: {
    /**
     * Current route object.
     */
    route: String,
    /**
     * Apps base URL.
     */
    baseUrl: String,
    /**
     * A list of projects
     */
    projects: Array,
    /**
     * Remove history from view if set to true.
     */
    noHistory: {
      type: Boolean,
      value: false
    },
    /** Is the app has been authorized by the user. */
    appAuthorized: {
      type: Boolean,
      value: false
    }
  },

  _itemTap: function(e) {
    e = Polymer.dom(e);
    var place = e.localTarget.dataset.place;
    if (place) {
      this.fire('navigate', {
        url: place
      });
    }
  },

  /**
   * Sort projects by name.
   */
  computeSort: function() {
    return function(a, b) {
      if (a.name > b.name) {
        return 1;
      }
      if (a.name < b.name) {
        return -1;
      }
      if (a.name === b.name) {
        return 0;
      }
    };
  },
  /**
   * Request app authorization.
   * Can be calle only if the user hasn't authorized the app.
   */
  _onAuth: function() {
    this.fire('authorize-requested');
  },
  /**
   * Request to sign out from the app.
   */
  _onSignOut: function() {
    this.fire('signout-requested');
  }
});
})();
