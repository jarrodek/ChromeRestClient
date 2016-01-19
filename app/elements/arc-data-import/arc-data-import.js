Polymer({
  is: 'arc-data-import',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],

  properties: {
    /**
     * True if some data are computed.
     */
    loading: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },
    /**
     * A flag set by `arc-file-importer` to determine if there is file import ongoing.
     */
    _fileImporting: Boolean
  },

  _canShowFileExportSection: function(_fileImporting) {
    return !_fileImporting;
  },

  _canShowServerSection: function(_fileImporting) {
    return !_fileImporting;
  },

  _importFileData: function(e) {
    this._setLoading(true);
    arc.app.importer.saveFileData(e.detail.data)
      .then(function() {
        //TODO: notify the user.
        console.info('Data imported.');
      }.bind(this))
      .catch(function(cause) {
        console.info('Data import error.', cause);
      })
      .finally(function() {
        this._setLoading(false);
      }.bind(this));
    console.log('_importFileData', e.detail);
  }
});
