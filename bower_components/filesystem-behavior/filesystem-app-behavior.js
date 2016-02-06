'use strict';

window.FileBehaviors = window.FileBehaviors || {};
/** @polymerBehavior */
FileBehaviors.FilesystemAppBehaviorImpl = {
  properties: {
    /**
     * The optional list of accept options for file opener. Each option will be presented as a
     * unique group to the end-user.
     * Each group definition can be defines as an object with following properties:
     * description {string} This is the optional text description for this option.
     * mimeTypes {Array<String>} Mime-types to accept, e.g. "image/jpeg" or "audio/*". One of
     *  mimeTypes or extensions must contain at least one valid element.
     * extensions {Array<String>} Extensions to accept, e.g. "jpg", "gif", "crx".
     */
    accepts: {
      type: Array
    },
    /**
     * Whether to accept multiple files. This is only supported for openFile and openWritableFile.
     */
    acceptsMultiple: Boolean,
  },
  /**
   * Read the file. Chrome API will be used to open a file.
   */
  read: function() {
    this._chooseEntry()
      .then(this._getContent.bind(this))
      .then(this._prepareContent.bind(this))
      .then(function() {
        this.fire('file-read');
      }.bind(this))
      .catch(function(cause) {
        this.fire('error', {
          'cause': 'read',
          'message': cause.message
        });
      }.bind(this));
  },
  write: function() {
    this._chooseEntry({
        type: 'saveFile'
      })
      .catch(function(cause) {
        // The only error here is that the user press cancel.
        // In this case just do nothing.
      }.bind(this))
      .then(this._truncate.bind(this))
      .then(this._writeFileEntry.bind(this))
      .then(function() {
        this.fire('file-save');
      }.bind(this))
      .catch(function(cause) {
        this.fire('error', {
          'cause': 'save',
          'message': cause.message
        });
      }.bind(this));
  },
  /**
   * Open the file using file picker and Chrome api.
   * By default this will open a file in read only mode.
   */
  _chooseEntry: function(opts) {
    opts = opts || {};
    if (this.fileName) {
      opts.suggestedName = this.fileName;
    }
    if (this.accepts) {
      opts.accepts = this.accepts;
    }
    if (typeof this.acceptsMultiple !== 'undefined') {
      opts.acceptsMultiple = this.acceptsMultiple;
    }
    return new Promise(function(resolve, reject) {
      chrome.fileSystem.chooseEntry(opts, function(entry) {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError);
          return;
        }
        resolve(entry);
      }.bind(this));
    }.bind(this));
  }
};

FileBehaviors.FilesystemAppBehavior = [
  FileBehaviors.FilesystemBehavior,
  FileBehaviors.FilesystemAppBehaviorImpl
];
