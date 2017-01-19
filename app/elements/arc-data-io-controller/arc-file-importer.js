(function() {
'use strict';

//TODO:20 add importer for new data structure.
Polymer({
  is: 'arc-file-importer',

  behaviors: [
    ArcBehaviors.ArcImportBehavior
  ],

  properties: {
    // True when file read reads the file.
    readingFile: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    'import-action': '_importAction'
  },

  // Opens a file selector.
  selectFile: function() {
    this.$$('input[type="file"]').click();
  },

  /**
   * Handler called when file has been added by the user.
   */
  _onImportFile: function(e) {
    var file = e.target.files[0];
    if (!file) {
      return;
    }
    this.set('readingFile', true);
    this.$.fileReader.blob = file;
  },
  /**
   * Handler called when the files has been read.
   */
  _importFileReady: function(e) {
    this.processImportData(e.detail.result);
    this.set('readingFile', false);
    this._resetFileDrop();
  },

  _resetFileDrop: function() {
    this.$$('input[type="file"]').value = null;
  },
  /**
   * A handler called when the file can't be read.
   */
  _importFileError: function(e) {
    this.set('readingFile', false);
    this.set('importError', 'The application was unable to read the file. ' + e.message);
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
  _importAction: function(e) {
    var action = e.detail.action;
    if (action === 'import') {
      this._importFileData(this.importData)
      .then(() => {
        if (!this.isImportError) {
          this.opened = false;
          StatusNotification.notify({
            message: 'The data has been imported',
            timeout: StatusNotification.TIME_SHORT
          });
        }
      });
    } else {
      this.opened = false;
    }
    this.resetImport();
    this._resetFileDrop();
  },

  // Computes if the loader should be hidden.
  _computeHideLoader: function(readingFile, importing) {
    return !readingFile && !importing;
  },
  // Computes if data preview table should be hidden.
  _computeHidePreviewTable: function(isImportData, importing, isImportError) {
    return !isImportData || importing || isImportError;
  }
});
})();
