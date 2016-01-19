Polymer({
  is: 'arc-import-data-table',
  properties: {
    projects: Object,
    requests: Object
  },
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

  importTap: function() {
    this.fire('import-action', {
      action: 'import'
    });
  },
  cancelTap: function() {
    this.fire('import-action', {
      action: 'cancel'
    });
  }
});
