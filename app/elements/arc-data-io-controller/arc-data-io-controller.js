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
    authorized: Boolean
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
      .then(function() {
        StatusNotification.notify({
          message: 'Data saved',
          timeout: StatusNotification.TIME_SHORT
        });
        this.fire('data-imported');
      }.bind(this))
      .catch(function(cause) {
        this.fire('app-log', {'message': ['Data import error: ', cause], 'level': 'error'});
        StatusNotification.notify({
          message: 'Unable to import data. Error details has been send ' +
            'to the developer.',
          timeout: StatusNotification.TIME_SHORT
        });
        arc.app.analytics.sendException('arc-data-import-controller::connectAppServer' +
          cause.message, false);
      })
      .finally(function() {
        this._setLoading(false);
      }.bind(this));
    arc.app.analytics.sendEvent('Settings usage', 'Import data', 'From file');
  },
  /** Authorize the app. */
  // _connectAppServer: function() {
  //   this.$.userProvider.authorize(true)
  //   .catch((err) => {
  //     StatusNotification.notify({
  //       message: 'Unable to authorize.',
  //       timeout: StatusNotification.TIME_SHORT
  //     });
  //     arc.app.analytics.sendException('arc-data-import-controller::connectAppServer' +
  //       err.message, false);
  //   });
  // }
});
})();
