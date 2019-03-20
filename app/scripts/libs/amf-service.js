export class AmfService {
  constructor() {
    this._assetHandler = this._assetHandler.bind(this);
    this._fileHandler = this._fileHandler.bind(this);
    this._resolveHandler = this._resolveHandler.bind(this);
  }

  /**
   * Observes for ARC's DOM events
   */
  observe() {
    window.addEventListener('api-process-link', this._assetHandler);
    window.addEventListener('api-process-file', this._fileHandler);
    window.addEventListener('api-resolve-model', this._resolveHandler);
  }
  /**
   * Removes observers for ARC's DOM events
   */
  unobserve() {
    window.removeEventListener('api-process-link', this._assetHandler);
    window.removeEventListener('api-process-file', this._fileHandler);
    window.removeEventListener('api-resolve-model', this._resolveHandler);
  }
  /**
   * Handler for the `api-process-link`. The event contains `url` of the asset
   * to download and additional, helper properties:
   * - mainFile {String} - API main file. If not set the program will try to discover
   * main API file.
   * - md5 {String} - File hash with md5. If not set the checksum is not tested.
   * - packaging {String} Compression format. Default to zip.
   *
   * @param {CustomEvent} e
   */
  _assetHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    const {url, mainFile, packaging} = e.detail;
    e.detail.result = this.processApiLink(url, mainFile, packaging);
  }
  /**
   * Handles `api-process-file` custom event.
   * The event is cancelled and the `result` property is set on
   * the detail object with resut of calling `processApiFile()`
   * @param {CustomEvent} e
   */
  _fileHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    if (!e.detail.file) {
      e.detail.result = Promise.reject(new Error('File not set.'));
      return;
    }
    e.detail.result = this.processApiFile(e.detail.file);
  }
  /**
   * Handler for the `api-resolve-model` event.
   * Resolves unresolved model using the "editing" pipeline of AMF.
   * @param {CustomEvent} e
   */
  _resolveHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    const {model, type} = e.detail;
    if (!model) {
      e.detail.result = Promise.reject(new Error('The "model" property is not set.'));
      return;
    }
    if (typeof model !== 'string') {
      e.detail.result = Promise.reject(new Error('The "model" property is not a string.'));
      return;
    }
    if (!type) {
      e.detail.result = Promise.reject(new Error('The API "type" property is not set.'));
      return;
    }
    e.detail.result = this.resolveAPiConsole(model, type);
  }

  /**
   * It downloads the file and processes it as a zipped API project.
   * @param {String} url API remote location.
   * @param {?String} mainFile API main file. If not set the program will try to
   * find the best match.
   * @param {?String} packaging Default to `zip`.
   * @return {Promise<String>} Promise resolved to the AMF json-ld model.
   */
  processApiLink(url, mainFile, packaging) {
    this.loading = true;
    const bufferOpts = {};
    if (packaging && packaging === 'zip') {
      bufferOpts.zip = true;
    }
    if (mainFile) {
      bufferOpts.mainFile = mainFile;
    }
    return this.downloadRamlData(url)
    .then((buffer) => this.processBuffer(buffer, bufferOpts))
    .then((result) => {
      this.loading = false;
      return result;
    })
    .catch((cause) => {
      this.loading = false;
      throw cause;
    });
  }

  /**
   * Manually closes the web worker created by previous zip file read.
   *
   * @return {Promise} A promise that resolves when the web worker was killed.
   */
  closeLastZipReader() {
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
  /**
   * Procesases file data.
   * If the blob is a type of `application/zip` it processes the file as a
   * zip file. Otherwise it processes it as a file.
   *
   * @param {File|Blob} file File to process.
   * @return {Promise<String>} Promise resolved to the AMF json-ld model
   */
  processApiFile(file) {
    this.loading = true;
    // return this._fileToBuffer(file)
    // .then((buffer) => this.processBuffer(buffer))
    return this.processBuffer(file)
    .then((result) => {
      this.loading = false;
      return result;
    })
    .catch((cause) => {
      this.loading = false;
      throw cause;
    });
  }
}
