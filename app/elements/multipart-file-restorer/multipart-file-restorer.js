(function(Polymer) {
  'use strict';

  /**
   *
   *
   * Final structure:
   * Array [
   *  { // file item
   *    name: String, name of the field
   *    value: Array of File or File
   *    file: true
   *  },
   *  { // text item
   *    name: String, name of the field
   *    value: String, value of the fiels
   *    contentType: String, part's content type
   *    text: true
   *  }
   * ]
   */
  class MultipartFileRestorer {
    beforeRegister() {
      this.is = 'multipart-file-restorer';
      /**
       *
       * @event multipart-data-read
       * @param {Array} value A form data array to be set in the multipart field.
       */
      this.properties = {
        /**
         * An array of multipart entries.
         * In ARC's data structure multipart data are stored as follows:
         * Array [
         *  name: String - field name
         *  data: Object - part properties
         *  {
         *    isFile: Boolean - true when the multi part is a file
         *    cacheName: String - file name in local filesystem, undefined when `isFile` == false.
         *    name: String - source file name, undefined when `isFile` == false.
         *    size: Number - source file size, undefined when `isFile` == false.
         *    type: String - source file mime type, undefined when `isFile` == false.
         *    mime: String - mime type of the entry, undefined when `isFile` == true.
         *    value: String - value of the property, undefined when `isFile` == true.
         *  },
         *  ...
         * ]
         */
        multipart: Array,
        // Last computation result, the multipart form data.
        value: {
          type: Array,
          notify: true,
          readOnly: true,
          observer: '_valueChanged'
        },

        quota: {
          type: Number,
          value: 1e+10 // 10 GB
        },
        /**
         * Granted by te user agent number of bytes avaibale to use by the app.
         * It will be filled up when the app already requested filesystem.
         *
         * @type Number
         */
        grantedQuota: {
          type: Number,
          value: 0,
          readOnly: true
        },
        /**
         * A handler to the filesystem.
         * Call `element`.requestFilesystem() to request filesystem and set up the handler.
         */
        fileSystem: {
          type: Object,
          readOnly: true
        }
      };
    }

    get behaviors() {
      return [FileBehaviors.WebFilesystemBehavior];
    }

    get observers() {
      return [
        '_multipartChanged(multipart)'
      ];
    }

    // Fires the `multipart-data-read` event.
    _valueChanged(value) {
      this.fire('multipart-data-read', {
        value: value
      });
    }

    /**
     * Called when the multipart property change.
     */
    _multipartChanged(multipart) {
      if (!multipart || !multipart.length) {
        return this._setValue(undefined);
      }

      // var promises = multipart.map((item) => this._processPart(item));
      // Promise.all(promises)
      this._processQueue(multipart)
      .then((result) => {
        this._setValue(result);
      });
    }

    _processQueue(multipart, result) {
      result = result || [];
      if (!multipart) {
        return Promise.resolve(result);
      }
      var part = multipart.shift();
      if (!part) {
        // end of queue
        return Promise.resolve(result);
      }

      return this._processPart(part)
      .then((part) => {
        result.push(part);
        return this._processQueue(multipart, result);
      });
    }

    /**
     * Processes the part item depending on a type (file, text).
     */
    _processPart(part) {
      if (!part) {
        return Promise.resolve();
      }
      if (!part.data.isFile) {
        return Promise.resolve({
          name: part.name,
          value: part.data.value,
          contentType: part.data.mime,
          text: true
        });
      }
      var result = {
        name: part.name,
        value: [],
        file: true
      };
      return this._restoreFileContent(part.data.cacheName)
      .then((data) => {
        if (data || data === '') {
          let file = new Blob([data], {type: part.data.type});
          result.value = [file];
        }
        return result;
      });
    }

    /**
     * Reads the cache file content
     */
    _restoreFileContent(fileName) {
      return this._requestFilesystem()
      .then(() => this.readFileEntries())
      .then((entries) => {
        let entry;
        for (let i = 0, len = entries.length; i < len; i++) {
          if (entries[i].name === fileName) {
            entry = entries[i];
            break;
          }
        }
        return entry;
      })
      .then((entry) => {
        if (!entry) {
          return;
        }
        return this._getContent(entry);
      })
      .catch((e) => {
        console.error(e);
        return undefined;
      });
    }

    readFileEntries() {
      if (this._fileEntries) {
        return Promise.resolve(this._fileEntries);
      }
      return new Promise((resolve, reject) => {
        let reader = this.fileSystem.root.createReader();
        let entries = [];
        let getEntries = () => {
          reader.readEntries((results) => {
            if (results.length) {
              entries = entries.concat(Array.from(results));
              getEntries();
            } else {
              this._fileEntries = entries;
              resolve(entries);
            }
          }, function(error) {
            reject(error);
          });
        };

        getEntries();
      });
    }
  }

  Polymer(MultipartFileRestorer);
})(Polymer);
