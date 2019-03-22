export class ApiSearch {
  constructor(unzip) {
    this.unzip = unzip;
  }

  findApiFile() {
    const popularNames = ['api.raml', 'api.yaml', 'api.json'];
    const exts = ['.raml', '.yaml', '.json'];
    const ignore = ['__macosx', 'exchange.json', '.ds_store'];
    const files = [];

    const it = this.unzip.names();
    while (true) {
      const next = it.next();
      if (next.done) {
        break;
      }
      const item = next.value;
      const lower = item.toLowerCase();
      if (ignore.indexOf(lower) !== -1) {
        continue;
      }
      if (popularNames.indexOf(lower) !== -1) {
        return Promise.resolve(item);
      }
      if (lower.indexOf('/') !== -1) {
        continue;
      }
      const ext = this.extname(lower);
      if (exts.indexOf(ext) !== -1) {
        files.push(item);
      }
    }

    if (files.length === 1) {
      return Promise.resolve(files[0]);
    }
    if (files.length) {
      return this._decideMainFile(files);
    }
    return Promise.resolve();
  }
  /**
   * Reads file extension name from a path.
   * @param {String} file File path.
   * @return {String|undefined} Extension name or undefined.
   */
  extname(file) {
    if (!file) {
      return;
    }
    const index = file.indexOf('.');
    if (index === -1) {
      return;
    }
    return file.substr(index);
  }

  _decideMainFile(files) {
    return this._findWebApiFile(files)
    .then((list) => {
      if (!list) {
        return files;
      }
      return list;
    });
  }

  /**
   * Reads all files and looks for 'RAML 0.8' or 'RAML 1.0' header which
   * is a WebApi.
   * @param {Array<String>} files List of candidates
   * @param {?Array<Object>} results List od results
   * @return {Promise<String>}
   */
  _findWebApiFile(files, results) {
    if (!results) {
      results = [];
    }
    const f = files.shift();
    if (!f) {
      if (!results.length) {
        results = undefined;
      }
      if (results && results.length === 1) {
        results = results[0];
      }
      return Promise.resolve(results);
    }
    return this._readApiType(f)
    .catch((e) => {
      console.warn('Unable to find file type', e);
    })
    .then((type) => {
      if (type && type.type) {
        results[results.length] = f;
      }
      return this._findWebApiFile(files, results);
    });
  }

  _readApiType(file) {
    return this.unzip.getFileContents(file)
    .then((data) => {
      if (data[0] === '{') {
        // OAS 1/2
        const match = data.match(/"swagger"(?:\s*)?:(?:\s*)"(.*)"/im);
        if (!match) {
          throw new Error('Expected OAS but could not find version header.');
        }
        const v = match[1].trim();
        return {
          type: `OAS ${v}`,
          contentType: 'application/json'
        };
      }
      const oasMatch = data.match(/openapi(?:\s*)?:(?:\s*)"?(\d\.\d*)"?/im);
      if (oasMatch) {
        const v = oasMatch[1].trim();
        return {
          type: `OAS ${v}`,
          contentType: 'application/yaml'
        };
      }
      const header = data.split('\n')[0].substr(2).trim();
      if (!header || header.indexOf('RAML ') !== 0) {
        throw new Error('The API file header is unknown');
      }
      if (header === 'RAML 1.0' || header === 'RAML 0.8') {
        return {
          type: header,
          contentType: 'application/raml'
        };
      }
      switch (header) {
        case 'RAML 1.0 Overlay':
        case 'RAML 1.0 Extension':
        case 'RAML 1.0 DataType':
        case 'RAML 1.0 SecurityScheme':
        case 'RAML 1.0 Trait':
        case 'RAML 1.0 Library':
        case 'RAML 1.0 NamedExample':
        case 'RAML 1.0 DocumentationItem':
        case 'RAML 1.0 ResourceType':
        case 'RAML 1.0 AnnotationTypeDeclaration':
          return {
            type: 'RAML 1.0',
            contentType: 'application/raml'
          };
      }
      throw new Error('Unsupported API file');
    });
  }

  _setupApiConsole(params) {
    if (!params) {
      return;
    }
    const {id, version} = params;
    if (!id) {
      return;
    }
    return this._loadApic()
    .then(() => {
      this.apiSelected = undefined;
      this.apiSelectedType = undefined;
      this._setIsApiConsole(true);
      this.apiProcessing = true;
      return this.$.apic.open(id, version);
    })
    .then(() => {
      this.apiSelected = 'summary';
      this.apiSelectedType = 'summary';
    })
    .catch((cause) => {
      this.apiProcessing = false;
      this._setIsApiConsole(false);
      this.notifyError(cause.message);
    });
  }

  _apiVersionMenuChanged(e) {
    const {value} = e.detail;
    if (!value) {
      return;
    }
    const id = this.$.apic.apiInfo._id;
    const params = {
      id,
      version: value
    };
    this._setupApiConsole(params);
  }
}
