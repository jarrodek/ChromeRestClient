'use strict';

//TODO: add importer for new data structure.
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
      computed: '_computeFileImportPreview(importData)'
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
    }
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
        if (!(result.projects && result.requests)) {
          throw new Error('Not an ARC file.');
        }
        this.importData = result;
      } catch (e) {
        //TODO: add status message
        console.error('arc-data-import::_importFileReady::JSON.parse::error', e);
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
    console.error('arc-data-import::_importFileError', e);
    arc.app.analytics.sendException(e.detail.message, true);
  },
  /** Compute is file is being imported. */
  _computeFileImportPreview: function(importData) {
    return importData && (importData.projects.length || importData.requests.length);
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
  }
});
