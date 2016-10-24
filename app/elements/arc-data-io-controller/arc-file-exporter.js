(function() {
'use strict';

Polymer({
  is: 'arc-file-exporter',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior
  ],
  properties: {
    /** True if user started exporting data to a file. */
    exporting: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },
    /** True if data are preparing to export */
    loading: {
      notify: false,
      readOnly: true,
      type: Boolean,
      value: false
    },
    /** `true` when the data is ready */
    dataReady: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },
    _writableContent: Object,
    _fileSuggestedName: String
  },
  /**
   * A handler for click on a "prepare data" button.
   */
  _prepareDataClick: function() {
    this._setExporting(true);
    this._setLoading(true);
    this._setDataReady(false);
    this.debounce('export-click', function() {
      this._prepareData();
      arc.app.analytics.sendEvent('Settings usage', 'Export data', 'Generate file');
    }, 50);
  },
  /**
   * Prepare user data to download.
   * This is an async operation since data preparation may take long time
   * (depending on number of entries).
   */
  _prepareData: function() {
    arc.app.importer.prepareExport({
      type: 'all' // dump all data available.
    })
    .then(function(data) {
      this.exportContent = data;
      this._setLoading(false);
      this._setDataReady(true);
    }.bind(this))
    .catch((cause) => {
      this.fire('app-log', {'message': cause, 'level': 'error'});
      StatusNotification.notify({
        message: cause.message
      });
      arc.app.analytics.sendException(cause.message, false);
    });
  },
  _saveData: function() {
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    this.fileSuggestedName = 'arc-export-' + day + '-' + month + '-' + year + '-export.json';
    this.exportMime = 'json';
    this.exportData();
  },

  onFileSaved: function() {
    this.exportContent = null;
    this._setDataReady(false);
    this._setLoading(false);
    this._setExporting(false);
    StatusNotification.notify({
      message: 'Data exported'
    });
  },

  onFileError: function(e) {
    this.exportContent = null;
    this._setDataReady(true);
    this._setLoading(false);
    this._setExporting(true);
    if (e.detail.message.indexOf('cancelled') !== -1) {
      return;
    }
    StatusNotification.notify({
      message: e.detail.message
    });
    arc.app.analytics.sendException(e.detail.message, true);
    this.fire('app-log', {'message': ['_saveFileError', e], 'level': 'error'});
  },

  _cancelExport: function() {
    this._setDataReady(false);
    this._setLoading(false);
    this._setExporting(false);
    this._writableContent = null;
    this._fileSuggestedName = null;
  }
});
})();
