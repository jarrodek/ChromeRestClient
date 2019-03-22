import {AmfParser} from './amf-parser.js';

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

  get parser() {
    if (!this.__parser) {
      this.__parser = new AmfParser();
    }
    return this.__parser;
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
    const id = Date.now();
    this.fire('process-loading-start', {
      message: 'Procerssing API file data',
      id
    });
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
      this.fire('process-loading-stop', {
        id
      });
      return result;
    })
    .catch((cause) => {
      this.loading = false;
      this.fire('process-loading-stop', {
        id
      });
      throw cause;
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
    const id = Date.now();
    this.fire('process-loading-start', {
      message: 'Procerssing API file data',
      id
    });
    this.loading = true;
    const opts = {};
    if (file.type === 'application/zip') {
      // Simple FS file check
      opts.zip = true;
    }
    let p;
    if (!opts.zip) {
      p = this._fileToBuffer(file)
      .then((buffer) => {
        if (this._bufferIsZip(buffer)) {
          opts.zip = true;
        }
      });
    } else {
      p = Promise.resolve();
    }
    return p.then(() => this.processBuffer(file, opts))
    .then((result) => {
      this.loading = false;
      this.fire('process-loading-stop', {
        id
      });
      return result;
    })
    .catch((cause) => {
      this.loading = false;
      this.fire('process-loading-stop', {
        id
      });
      throw cause;
    });
  }
  /**
   * Parses API data to AMF model.
   * @param {Blob} file Buffer created from API file.
   * @param {Object} opts Processing options:
   * - zip {Boolean} If true the buffer represents zipped file.
   * - mainFile {String} API main file if known
   * @return {Promise<String>} Promise resolved to the AMF json-ld model
   */
  processBuffer(file, opts) {
    if (!this.loading) {
      this.loading = true;
    }
    if (!opts) {
      opts = {};
    }
    this.parser.setSource(file, opts);
    return this.parser.prepare()
    .then(() => this.parser.resolve(opts.mainFile))
    .then((candidates) => {
      if (candidates) {
        return this.notifyApiCandidates(candidates)
        .catch((cause) => {
          return this.parser.clear()
          .then(() => {
            if (cause) {
              throw cause;
            }
          });
        })
        .then((file) => {
          if (file) {
            return this.parser.parse(file);
          }
          return this.parser.clear();
        });
      } else {
        return this.parser.parse();
      }
    })
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
   * Tests if the buffer has ZIP file header.
   * @param {ArrayBuffer} buffer File buffer
   * @return {Boolean} true if the buffer is compressed zip.
   */
  _bufferIsZip(buffer) {
    const view = new Uint8Array(buffer);
    return view[0] === 0x50 && view[1] === 0x4b;
  }

  _fileToBuffer(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.addEventListener('loadend', (e) => {
        resolve(e.target.result);
      });
      reader.addEventListener('error', () => {
        reject(new Error('Unable to translate the file to buffer'));
      });
      reader.readAsArrayBuffer(blob);
    });
  }

  fire(type, detail) {
    const e = new CustomEvent(type, {
      bubbles: true,
      cancelable: false,
      detail
    });
    document.body.dispatchEvent(e);
    return e;
  }
  /**
   * Dispatches `process-error` custom event.
   * This only happens when `process-exchange-asset-data` event was handled
   *
   * @param {String} message Message to render.
   */
  notifyError(message) {
    console.error(message);
    this.fire('process-error', {
      message,
      source: 'amf-service'
    });
  }
  /**
   * Dispatches `api-data-ready` custom event.
   * This only happens when `process-exchange-asset-data` event was handled
   *
   * @param {Object} result Parsing results with API `model` and `type`.
   */
  notifyApi(result) {
    this.fire('api-data-ready', result);
  }
  /**
   * Dispatches `api-select-entrypoint` custom event.
   * The app should handle this event in order to proceed with the parsing flow.
   * @param {Array<String>} candidates
   * @return {Promise<String|undefined>}
   */
  notifyApiCandidates(candidates) {
    const e = this.fire('api-select-entrypoint', {
      candidates
    });
    if (e.defaultPrevented) {
      return e.detail.result;
    }
    return Promise.reject(new Error('No UI for selecting API main file :('));
  }

  resolveAPiConsole(model, type) {
    const id = Date.now();
    this.fire('process-loading-start', {
      message: 'Procerssing API content',
      id
    });
    return this.parser.resolveApiConsole(model, type)
    .then((result) => {
      this.fire('process-loading-stop', {
        id
      });
      return result;
    })
    .catch((cause) => {
      this.fire('process-loading-stop', {
        id
      });
      throw cause;
    });
  }

  /**
   * Downloads and processes RAML data.
   *
   * @TODO: Handle authorization.
   *
   * @param {String} url URL to RAML zip asset.
   * @return {Promise} Resolved when components are loaded and process
   * started.
   */
  downloadRamlData(url) {
    return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to download the asset. Status: ${response.status}`);
      }
      return response.blob();
    });
  }
}
