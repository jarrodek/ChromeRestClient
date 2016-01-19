Polymer({
  is: 'arc-import-data-table',
  /**
   * Fired when the user perform an action import or cancel.
   *
   * @event import-action
   * @param {String} action An cation name. Either `import` or `cancel`.
   */
  properties: {
    /**
     * A project list to be associated with requests.
     */
    projects: Array,
    /**
     * A request objects array.
     */
    requests: Array
  },
  /**
   * Compute if the current request have associated project to it and return it name.
   *
   * @param {Object} item a request object imported from the file.
   * @param {Array} projects A list of projects imported from the file.
   * @return {String} Project name or 'none' if not found. 
   */
  _computeProjectName: function(item, projects) {
    if (!item.project || isNaN(item.project)) {
      return 'none';
    }
    if (!projects.length) {
      return 'none';
    }
    for (var i = 0, length = projects.length; i < length; i++) {
      if (projects[i].id === item.project) {
        return projects[i].name;
      }
    }
    return 'none';
  },
  /**
   * Import button tapped.
   */
  importTap: function() {
    this.fire('import-action', {
      action: 'import'
    });
  },
  /**
   * Cancel button tapped.
   */
  cancelTap: function() {
    this.fire('import-action', {
      action: 'cancel'
    });
  }
});
