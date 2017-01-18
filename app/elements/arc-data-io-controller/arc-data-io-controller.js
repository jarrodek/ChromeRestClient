(function() {
'use strict';

Polymer({
  is: 'arc-data-io-controller',
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
    /** A flag set to `true` when export has been initialized */
    _fileExporting: Boolean,
    /** True if file import section should be visible */
    _showFileImport: {
      type: Boolean,
      value: true,
      computed: '_canShowFileImport(_fileExporting)'
    },
    /** `true` when file export should be visible */
    _showFileExport: {
      type: Boolean,
      value: true,
      computed: '_canShowFileExport(_fileImporting)'
    },
    /** `true` if server import / export options should be visible */
    _showServerOptions: {
      type: Boolean,
      value: true,
      computed: '_canShowServerSection(_fileImporting, _fileExporting)'
    },
    authorized: Boolean,
    hasImportData: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },
  /**
   * Ping server for session state on show.
   */
  onShow: function() {
    this._setPageTitle('Data import / export');
  },
  onHide: function() {
    this._setPageTitle('');
  },
  /**
   * to be removed?
   */
  _canShowFileImport: function(_fileExporting) {
    return !_fileExporting;
  },
  /**
   * to be removed?
   */
  _canShowFileExport: function(_fileImporting) {
    return !_fileImporting;
  },
  /**
   * to be removed?
   */
  _canShowServerSection: function(_fileImporting, _fileExporting) {
    return !_fileImporting && !_fileExporting;
  },
  /**
   * Perform a data import.
   */
  _importFileData: function(e) {
    this._setLoading(true);

    arc.app.importer.saveFileData(e.detail.data)
    .then(() => {
      StatusNotification.notify({
        message: 'Data saved',
        timeout: StatusNotification.TIME_SHORT
      });
      this.fire('data-imported');
      this._setLoading(false);
    })
    .catch((cause) => {
      console.error('Import data error', cause);
      this.fire('app-log', {'message': ['Data import error: ', cause], 'level': 'error'});
      StatusNotification.notify({
        message: 'Unable to import data. ' + cause.message,
        timeout: StatusNotification.TIME_SHORT
      });
      this.fire('send-analytics', {
        type: 'exception',
        description: 'arc-data-import-controller' + cause.message,
        fatal: false
      });
      this._setLoading(false);
    });

    this.fire('send-analytics', {
      type: 'event',
      category: 'Settings usage',
      action: 'Import data',
      label: 'From file'
    });
  }
});
})();
