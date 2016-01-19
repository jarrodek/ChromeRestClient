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
    _fileImporting: Boolean,
    _fileExporting: Boolean,
    /** True if file import section should be visible */
    _showFileImport: {
      type: Boolean,
      value: true,
      computed: '_canShowFileImport(_fileExporting)'
    },
    _showFileExport: {
      type: Boolean,
      value: true,
      computed: '_canShowFileExport(_fileImporting)'
    },
    _showServerOptions: {
      type: Boolean,
      value: true,
      computed: '_canShowServerSection(_fileImporting, _fileExporting)'
    }
  },
  _canShowFileImport: function(_fileExporting) {
    return !_fileExporting;
  },

  _canShowFileExport: function(_fileImporting) {
    return !_fileImporting;
  },

  _canShowServerSection: function(_fileImporting, _fileExporting) {
    return !_fileImporting && !_fileExporting;
  },

  _importFileData: function(e) {
    this._setLoading(true);
    arc.app.importer.saveFileData(e.detail.data)
      .then(function() {
        StatusNotification.notify({message:'Data saved', timeout: StatusNotification.TIME_SHORT});
      }.bind(this))
      .catch(function(cause) {
        console.info('Data import error.', cause);
        StatusNotification.notify({message:'Unable to import data. Error details has been send ' +
          'to the developer.', timeout: StatusNotification.TIME_SHORT});
      })
      .finally(function() {
        this._setLoading(false);
      }.bind(this));
    console.log('_importFileData', e.detail);
  }
});
