Polymer({
  is: 'drop-file-importer',

  behaviors: [
    Polymer.IronOverlayBehavior,
    ArcBehaviors.ArcImportBehavior
  ],

  properties: {
    // True when file is dragged over the element.
    dragging: {
      type: Boolean,
      value: true,
      readOnly: true,
      notify: true
    },
    // True when file read reads the file.
    readingFile: {
      type: Boolean,
      value: false
    }
  },

  listeners: {
    'dragenter': '_onDragEnter',
    'dragleave': '_onDragLeave',
    'dragover': '_onDragOver',
    'drop': '_onDrop',
    'import-action': '_importAction'
  },

  // Handler for dragenter event.
  _onDragEnter: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._setDragging(true);
    this.resetImport();
  },

  // Handler for dragenter event.
  _onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
  },

  _onDragLeave: function(e) {
    e.stopPropagation();
    e.preventDefault();
    // main.js closes the overlay if drag is out.
  },

  // Handler for drop event.
  _onDrop: function(e) {
    this._setDragging(false);
    e.stopPropagation();
    e.preventDefault();
    var files = e.dataTransfer.files;
    this._processEntries(files);
  },

  _processEntries: function(entries) {
    this.set('readingFile', true);
    this.$.fileReader.blob = entries[0];
  },

  /**
   * Handler called when the files has been read.
   */
  _importFileReady: function(e) {
    this.processImportData(e.detail.result);
    this.set('readingFile', false);
  },
  /**
   * A handler to the `import-action` event fired by the preview table.
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
