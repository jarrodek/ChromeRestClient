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
      computed: '_canShowFileExport(hasImportData)'
    },
    hasImportData: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    isDriveImport: {
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
  }
});
})();
