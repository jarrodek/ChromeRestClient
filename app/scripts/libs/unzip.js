/* global zip */
export class Unzip {
  cleanup() {
    /**
     * Read zip entries.
     * @type {Array<Object>}
     */
    this.entries = undefined;
    /**
     * Unzipped file root path.
     * If the zip file in the root has a single directory this will
     * be the name of the directory.
     * @type {String}
     */
    this.rootPath = undefined;
    return this.closeLastReader();
  }

  unzip(file) {
    return this.cleanup()
    .then(() => this._unzipFileWorker(file))
    .then((entries) => {
      this._setZipRootFolter(entries);
      this.entries = entries;
    });
  }

  /**
   * Manually closes the web worker created by previous zip file read.
   *
   * @return {Promise} A promise that resolves when the web worker was killed.
   */
  closeLastReader() {
    if (!this._zipReader) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this._zipReader.close(() => {
        this._zipReader = undefined;
        resolve();
      });
    });
  }

  _unzipFileWorker(file) {
    zip.workerScriptsPath = '/scripts/libs/zipjs/';
    return new Promise((resolve, reject) => {
      zip.createReader(new zip.BlobReader(file), (zipReader) => {
        this._zipReader = zipReader;
        zipReader.getEntries((entries) => resolve(entries));
      }, (message) => reject(message));
    });
    // READ: https://gildas-lormeau.github.io/zip.js/core-api.html
    // https://github.com/duanyao/zip.js/tree/integrate/WebContent
  }

  /**
   * Sets `zipRootPath` property
   * @param {[type]} entries [description]
   */
  _setZipRootFolter(entries) {
    let rootPath = '';
    for (let i = 0, len = entries.length; i < len; i++) {
      const item = entries[i];
      if (item.filename.indexOf('/') === -1) {
        rootPath = '';
        break;
      }
      if (!rootPath) {
        rootPath = item.filename.split('/')[0] + '/';
      }
    }
    this.rootPath = rootPath;
  }

  getFile(name) {
    const fullName = `${this.rootPath}${name}`;
    const entries = this.entries || [];
    for (let i = 0, len = entries.length; i < len; i++) {
      const item = entries[i];
      if (item.filename === fullName) {
        return item;
      }
    }
  }

  getFileContents(name) {
    const file = this.getFile(name);
    if (!file) {
      return Promise.reject(new Error(`File ${name} not found.`));
    }
    return new Promise((resolve) => {
      file.getData(new zip.TextWriter(), (text) => {
        resolve(text);
      });
    });
  }

  * [Symbol.iterator]() {
    const entries = this.entries || [];
    for (let i = 0, len = entries.length; i < len; i++) {
      const item = entries[i];
      yield item;
    }
  }

  * names() {
    const entries = this.entries || [];
    for (let i = 0, len = entries.length; i < len; i++) {
      const item = entries[i];
      let name = item.filename;
      if (this.rootPath) {
        name = name.replace(this.rootPath, '');
      }
      yield name;
    }
  }
}
