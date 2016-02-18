'use strict';

window.ArcBehaviors = window.ArcBehaviors || {};
/**
 * The `ArcFileExportBehavior` contains a method to export data to file.
 * Include `arc-file-export-behavior.html` to your `elements.html` file.
 *
 * To handle a callback events implement the `onFileSaved` and `onFileError` in your component.
 *
 *
 * @polymerBehavior
 */
ArcBehaviors.ArcFileExportBehavior = {
  properties: {
    /**
     * Suggested file name.
     * This is used by save file prompt and the name of the file will be presented to the user.
     * User can decide to change it.
     */
    fileSuggestedName: {
      type: String,
      observer: '_fileSuggestedChanged'
    },
    /**
     * A data to export to file.
     * Its type depend on `exportMime` attribute.
     */
    exportContent: {
      tye: Object,
      observer: '_contentChanged'
    },
    /**
     * Exported data mime type.
     * Currently supported options are `json` and `text`.
     * When set to `json`, JSON.stringnify will be called on `exportContent`.
     */
    exportMime: {
      type: String,
      value: 'json',
      observer: '_mimeChanged'
    },
    /**
     * A writer used to save data.
     */
    fileWriter: Object,
    /**
     * A handler to success function
     */
    _fileWriteHandler: {
      value: function() {
        return this.onFileSaved.bind(this);
      }
    },
    /**
     * A handler to error function
     */
    _fileErrorHandler: {
      value: function() {
        return this.onFileError.bind(this);
      }
    }
  },

  ready: function() {
    this._createWriter();
    if (this.fileSuggestedName) {
      this._fileSuggestedChanged();
    }
    if (this.exportContent) {
      this._contentChanged();
    }
    if (this.exportMime) {
      this._mimeChanged();
    }
  },

  detached: function() {
    if (!this.fileWriter) {
      this.fileWriter.removeEventListener('file-save', this._fileWriteHandler);
      this.fileWriter.removeEventListener('error', this._fileErrorHandler);
      this.fileWriter.parentNode.removeChild(this.fileWriter);
    }
    this.fileWriter = null;
  },
  /**
   * Append file writer component to the body.
   */
  _createWriter: function() {
    if (!this.fileWriter) {
      this.fileWriter = document.createElement('chrome-app-filesystem');
    }
    this.fileWriter.addEventListener('file-save', this._fileWriteHandler);
    this.fileWriter.addEventListener('error', this._fileErrorHandler);
    document.body.appendChild(this.fileWriter);
  },

  _contentChanged: function() {
    if (this.fileWriter && this.exportContent) {
      this.fileWriter.content = this.exportContent;
    }
  },

  _fileSuggestedChanged: function() {
    if (this.fileWriter && this.fileSuggestedName) {
      this.fileWriter.fileName = this.fileSuggestedName;
    }
  },

  _mimeChanged: function() {
    if (this.fileWriter && this.exportMime) {
      this.fileWriter.readAs = this.exportMime;
      switch (this.exportMime) {
        case 'json':
          this.fileWriter.mime = 'application/json';
        break;
        case 'text':
          this.fileWriter.mime = 'text/plain';
        break;
        default:
          this.fileWriter.mime = this.exportMime;
          console.warn('Setting up unsupported mime type for file writer.');
      }
    }
  },
  /**
   * Export current data to file.
   */
  exportData: function() {
    this.fileWriter.write();
  },
  /** Override this function to handle an event */
  onFileSaved: function() {},
  /** Override this function to handle an event */
  onFileError: function() {}
};
