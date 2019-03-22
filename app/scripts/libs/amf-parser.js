import {Unzip} from './unzip.js';
import {ApiSearch} from './api-search.js';

class FileLoader {
  constructor(unzip) {
    this.unzip = unzip;
  }

  processResource(resource) {
    let url = resource.replace('http://a.ml/amf/', '');
    if (url.indexOf('http') === 0) {
      return url;
    }
    const parser = new URL(url, 'http://a.ml');
    url = parser.toString();
    url = url.replace('http://a.ml/', '');
    if (url[0] === '/') {
      url = url.substr(1);
    }
    return url;
  }

  fetch(resource) {
    const url = this.processResource(resource);
    if (url.indexOf('http') === 0) {
      return this._fetch(url);
    }
    return this.unzip.getFileContents(url)
    .then((content) => {
      let ct;
      if (url.indexOf('.raml') !== -1 || content.indexOf('#%RAML') !== -1) {
        ct = 'application/yaml';
      } else if (url.indexOf('.json') !== -1 || content[0] === '{' || content[0] === '[') {
        ct = 'application/json';
      } else if (url.indexOf('.xml') !== -1 || url.indexOf('.xsd') !== -1) {
        ct = 'application/xml';
      } else {
        ct = 'text/plain';
      }
      return new Amf.client.remote.Content(content, url, ct);
    })
    .catch((cause) => {
      new Amf.ResourceNotFound(`Fetch error [${url}]: ${cause.message}`);
    });
  }

  accepts(/* resource */) {
    // console.log('accepts called', resource);
    return true;
  }

  _fetch(url) {
    let ct;
    return fetch(url)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Unable to fetch ${url}`);
      }
      ct = response.headers.get('content-type');
      return response.text();
    })
    .then((rsp) => {
      return new Amf.client.remote.Content(rsp, url, ct);
    })
    .catch((cause) => {
      new Amf.ResourceNotFound(`Fetch error [${url}]: ${cause.message}`);
    });
  }
}

let pluginsRegistered = false;
let amfInited = false;
/* global Amf */
export class AmfParser {
  get unzip() {
    if (!this.__unzip) {
      this.__unzip = new Unzip();
    }
    return this.__unzip;
  }

  clear() {
    this.isZip = undefined;
    this.validate = undefined;
    this._mainFile = undefined;
    return this.__unzip.cleanup();
  }

  /**
   * The same as with constructror but resets the sate.
   * @param {Blob} source The file to process
   * @param {?Object} opts Process options:
   * - zip {Boolean} - if true it treats the source as a zip data. Files are
   * unzzipped to a temporary location before processing.
   * - validate {Boolean} - if true it validates the API when parsing.
   * Validation is made in the `parse` phase and results (as string) are stored
   * in `validationResult` property of the service.
   */
  setSource(source, opts) {
    if (!opts) {
      opts = {};
    }
    this.source = source;
    this.isZip = opts.zip;
    this.validate = opts.validate;
    // created at run time.
    /**
     * API main file (entry point) in the working directory.
     * If this is set it means the files has been resolved.
     * @type {String}
     */
    this._mainFile = undefined;
  }
  prepare() {
    if (this.isZip) {
      return this._unzipSource();
    }
    return Promise.resolve();
  }

  _unzipSource() {
    return this.unzip.unzip(this.source);
  }

  resolve(mainFile) {
    if (!this.isZip) {
      return Promise.resolve();
    }
    if (this._mainFile) {
      return Promise.resolve();
    }
    if (mainFile) {
      const file = this.unzip.getFile(mainFile);
      if (file) {
        this._mainFile = mainFile;
        return Promise.resolve();
      } else {
        const msg = `File ${mainFile} does not exist.`;
        console.warn(msg);
        return Promise.reject(new Error(msg));
      }
    }
    const search = new ApiSearch(this.unzip);
    return search.findApiFile()
    .then((result) => {
      if (!result) {
        throw new Error('Unable to find API files in the source location');
      }
      if (result instanceof Array) {
        return result;
      }
      this._mainFile = result;
    });
  }

  parse(mainFile) {
    if (mainFile && typeof mainFile === 'string') {
      this._mainFile = mainFile;
    }
    if (!this._mainFile) {
      return this.clear()
      .catch(() => {})
      .then(() => Promise.reject(new Error('API main file not defined')));
    }
    const search = new ApiSearch(this.unzip);
    let apiType;
    return search._readApiType(this._mainFile)
    .then((type) => {
      apiType = type;
      return this._runParser(this._mainFile, type);
    })
    .then((model) => {
      this.clear();
      return {
        model,
        type: apiType
      };
    });
  }

  _registerAmfPlugins() {
    if (pluginsRegistered) {
      return;
    }
    pluginsRegistered = true;
    Amf.plugins.document.WebApi.register();
    Amf.plugins.document.Vocabularies.register();
    Amf.plugins.features.AMFValidation.register();
  }

  _runParser(mainFile, type) {
    this._registerAmfPlugins();
    let p;
    if (amfInited) {
      p = Promise.resolve();
    } else {
      p = Amf.Core.init();
    }
    amfInited = true;
    return p
    .then(() => this.unzip.getFileContents(mainFile))
    .then((data) => {
      const parser = this._getParser(type);
      return parser.parseStringAsync(data);
    })
    .then((doc) => {
      let validateProfile;
      switch (type.type) {
        case 'RAML 1.0': validateProfile = Amf.ProfileNames.RAML; break;
        case 'RAML 0.8': validateProfile = Amf.ProfileNames.RAML08; break;
        case 'OAS 2.0':
        case 'OAS 3.0':
          validateProfile = Amf.ProfileNames.OAS;
          break;
      }
      return Amf.AMF.validate(doc, validateProfile)
      .then((result) => {
        if (!result.conforms) {
          console.warn('API varidation error.');
          console.warn(result.toString());
        }
        return doc;
      });
    })
    .then((doc) => {
      const generator = Amf.Core.generator('AMF Graph', 'application/ld+json');
      return generator.generateString(doc);
    })
    .catch((cause) => {
      let m = `AMF parser: Unable to parse API ${mainFile}.\n`;
      m += cause.s$1 || cause.message;
      throw new Error(m);
    });
  }

  _getParser(type) {
    const handler = new FileLoader(this.unzip);
    const env = new Amf.client.environment.Environment();
    const loader = env.addClientLoader(handler);
    switch (type.type) {
      case 'RAML 0.8': return Amf.Raml08Parser(loader);
      case 'RAML 1.0': return Amf.Raml10Parser(loader);
      case 'OAS 2.0':
      case 'OAS 3.0':
        if (type.contentType === 'application/json') {
          return Amf.Oas20Parser(loader);
        } else {
          return Amf.Oas20YamlParser(loader);
        }
        break;
      default:
        throw new Error('Unknown API type.');
    }
  }

  resolveApiConsole(model, type) {
    this._registerAmfPlugins();
    let p;
    if (amfInited) {
      p = Promise.resolve();
    } else {
      p = Amf.Core.init();
    }
    amfInited = true;
    return p
    .then(() => this.modelToDoc(model))
    .then((doc) => this.generateEditingResolvedModel(doc, type))
    .catch((cause) => {
      let m = `AMF parser: Unable to resolve AMF ld+json model.\n`;
      if (cause.message) {
        m += cause.message;
      } else if (cause.toString) {
        m += cause.toString();
      }
      throw new Error(m);
    });
  }
  /**
   * Parses AMF ld+json model to AMF document.
   * The model has to be unresolved.
   *
   * @param {String} model
   * @return {Promise<Object>} AMF document.
   */
  modelToDoc(model) {
    const parser = Amf.Core.parser('AMF Graph', 'application/ld+json');
    return parser.parseStringAsync(model);
  }
  /**
   * Generates resolved AMF model using editing pipeline (required by API console).
   * @param {Object} doc Parsed API document to AMF object.
   * @param {String} type API original type (RAML 1.0, OAS 2.0, etc)
   * @return {Promise<String>} A promise resolved to AMF object.
   */
  generateEditingResolvedModel(doc, type) {
    const resolver = Amf.Core.resolver(type);
    doc = resolver.resolve(doc, 'editing');
    const generator = Amf.Core.generator('AMF Graph', 'application/ld+json');
    const opts = Amf.render.RenderOptions().withSourceMaps.withCompactUris;
    return generator.generateString(doc, opts);
  }
}
