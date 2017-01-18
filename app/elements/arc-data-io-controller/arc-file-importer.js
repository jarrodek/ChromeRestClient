(function() {
'use strict';

//TODO:20 add importer for new data structure.
Polymer({
  is: 'arc-file-importer',
  /**
   * Fired when the user click on import button.
   *
   * @event import
   */
  properties: {
    /** Data to import. */
    importData: {
      type: Object,
      value: {
        projects: [],
        requests: []
      }
    },
    /** True if import is initialized. */
    isFileImport: {
      type: Boolean,
      computed: '_computeFileImportPreview(importData)',
      notify: true
    },
    /**
     * True if user started importing a file.
     * It will remain `true` until operation finish either by successful import or cancellation.
     */
    importing: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },
    importFileReader: Boolean
  },
  /**
   * Handler called when file has been added by the user.
   */
  _onImportFile: function(e) {
    var file = e.detail.file;
    if (!file) {
      return;
    }
    this._setImporting(true);
    this.$.fileReader.blob = file;
  },
  /**
   * Handler called when the files has been read.
   */
  _importFileReady: function(e) {
    if (e.detail.result) {
      try {
        let result = JSON.parse(e.detail.result);
        if (!(result.projects || result.requests || result.history)) {
          if ('headers' in result && 'url' in result && 'method' in result) {
            //old file.
            this.importData = {
              projects: [],
              requests: [result]
            };
            return;
          }
          StatusNotification.notify({
            message: 'This is not an ARC file.'
          });
          throw new Error('Not an ARC file.');
        }
        this.importData = result;
        if (!this.isFileImport) {
          StatusNotification.notify({
            message: 'File is empty'
          });
          this.importData = null;
          this._resetFileDrop();
          this._setImporting(false);
        }
      } catch (e) {
        console.error('File read error', e);
        this.fire('app-log', {
          'message': ['arc-data-import::_importFileReady::JSON.parse::error', e],
          'level': 'error'
        });
        StatusNotification.notify({
          message: 'Unable to parse the file.'
        });
        this._resetFileDrop();
        this._setImporting(false);
      }
    }
  },
  _resetFileDrop: function() {
    var fileDrop = Polymer.dom(this.root).querySelector('#fileDrop');
    if (fileDrop) {
      fileDrop.reset();
    }
  },
  /**
   * A handler called when the file can't be read.
   */
  _importFileError: function(e) {
    this._setImporting(false);
    StatusNotification.notify({
      message: 'File read error.'
    });
    this._resetFileDrop();
    this.fire('app-log', {'message': ['arc-data-import::_importFileError', e], 'level': 'error'});
    this.fire('send-analytics', {
      type: 'exception',
      description: e.detail.message,
      fatal: true
    });
  },
  /** Compute is file is being imported. */
  _computeFileImportPreview: function(importData) {
    return !!(importData && (importData.projects.length || importData.requests.length));
  },

  /**
   * This handler is called when the user decide to import from file or cancel the operation.
   */
  _importTableAction: function(e) {
    var action = e.detail.action;
    if (action === 'import') {
      this.fire('import', {
        data: this.importData
      });
    }
    this._setImporting(false);
    this.importData = null;
    this._resetFileDrop();
  },
  /**
   * Gets the data for given `variable` name from object.
   *
   * @param {Object} record Polymer's change record for an object
   * @param {String} variable Variable name (object's key) where the data is
   */
  _computeData: function(record, variable) {
    if (!record || !record.base) {
      return;
    }
    return record.base[variable];
  }
});
})();
