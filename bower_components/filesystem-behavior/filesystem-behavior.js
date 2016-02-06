'use strict';

window.FileBehaviors = window.FileBehaviors || {};
/** @polymerBehavior */
FileBehaviors.FilesystemBehavior = {
  /**
   * Fired when the file has been read.
   * Then the `content` attribute is set to file's content.
   *
   * @event file-read
   */
  /**
   * Fired when the file has been saved.
   *
   * @event file-save
   */
  /**
   * Fired when error occurr.
   *
   * @event error
   * @param {String} cause Either: `read` or `save`
   * @param {String} message An error message
   */
  properties: {
    /**
     * When prompting for a file to save it will be used as a suggested name.
     * It will ve set to opened file name when the file is opened.
     */
    fileName: {
      type: String,
      notify: true
    },
    /**
     * The content of the file.
     * It will be set to file content when called `read()` function. You can set  this
     * property with any value that should be written to the file using `save()` function.
     * The type of the `content` attribute is depended of the `readAs` attribute or string
     * if the element wasn't able to parse the content according to set type.
     */
    content: {
      type: Object,
      notify: true
    },
    /**
     * Set a type of the content to perform auto parsing. By default text will be used.
     * If there is error while parsing the data it will set file content as string.
     * Currently only `text` and `json` values are supported.
     */
    readAs: {
      type: String,
      value: 'text'
    },
    /**
     * A mime type of the file.
     */
    mime: {
      type: String,
      value: 'text/pain'
    }
  },
  /**
   * Get the file content from the entry.
   *
   * @param {FileEntry} fileEntry File entry to read from.
   */
  _getContent: function(fileEntry) {
    return new Promise(function(resolve, reject) {
      fileEntry.file(function(file) {
        let reader = new FileReader();
        reader.onloadend = function() {
          resolve(this.result);
        }.bind(this);
        reader.onerror = function(error) {
          reject(error);
        }.bind(this);
        reader.readAsText(file);
      }.bind(this), function(error) {
        reject(error);
      }.bind(this));
    }.bind(this));
  },
  /**
   * After file read use `readAs` attribute and try to parse file content.
   * Finally the contant will be set to `content` attribute.
   */
  _prepareContent: function(content) {
    switch (this.readAs) {
      case 'json':
        try {
          this.content = JSON.parse(content);
        } catch (e) {
          this.content = content;
          console.warn('The content wasn\'t a JSON value.');
        }
        break;
      default:
        this.content = content;
        break;
    }
  },
  /**
   * Truncate the file.
   * To override the file content it must be truncated first.
   *
   * @param {FileEntry} fileEntry File entry to be truncated.
   */
  _truncate: function(fileEntry) {
    return new Promise(function(resolve, reject) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.addEventListener('writeend', function() {
          resolve(fileEntry);
        }.bind(this));
        fileWriter.addEventListener('error', function(e) {
          reject(e);
        }.bind(this));
        fileWriter.truncate(0);
      }.bind(this), reject);
    }.bind(this));
  },
  /**
   * Wrtite `content` to the file.
   */
  _writeFileEntry: function(fileEntry) {
    var toWrite = this._getWriteableContent();
    if (typeof toWrite === 'string') {
      toWrite = [toWrite];
    }
    var mime = this.mime;
    return new Promise(function(resolve, reject) {
      fileEntry.createWriter(function(fileWriter) {
        fileWriter.addEventListener('writeend', function() {
          resolve(fileEntry);
        }.bind(this));
        fileWriter.addEventListener('error', function(e) {
          reject(e);
        }.bind(this));
        let blob = new Blob(toWrite, {
          type: mime
        });
        fileWriter.write(blob);
      }.bind(this), reject);
    }.bind(this));
  },
  /**
   * Get a content to write to the file.
   */
  _getWriteableContent: function() {
    var content = '';
    switch (this.readAs) {
      case 'json':
        content = JSON.stringify(this.content);
        break;
      default:
        content = this.content;
        break;
    }
    return content;
  }
};
