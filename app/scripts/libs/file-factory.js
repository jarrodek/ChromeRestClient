export class FileFactory {
  /* global chrome */
  constructor() {
    this._dataSaveHandler = this._dataSaveHandler.bind(this);
  }

  observe() {
    window.addEventListener('file-data-save', this._dataSaveHandler);
  }

  _dataSaveHandler(e) {
    e.preventDefault();
    let {content, file, options} = e.detail;
    if (!options) {
      options = {};
    }
    if (!options.contentType) {
      options.contentType = 'application/restclient+data';
    }
    e.detail.result = this.writeContent(file, content, options);
  }

  writeContent(fileName, content, options) {
    return this._getWriter(fileName)
    .then((writer) => this._write(writer, content, options));
  }


  _prepareContent(data) {
    if (data instanceof Blob) {
      return data;
    }
    if (typeof data === 'string') {
      return [data];
    }
    return [JSON.stringify(data)];
  }

  _getWriter(name) {
    const opts = {
      type: 'saveFile',
      suggestedName: name
    };
    return new Promise((resolve) => {
      chrome.fileSystem.chooseEntry(opts, function(entry) {
        entry.createWriter(function(writer) {
          resolve(writer);
        });
      });
    });
  }

  _write(writer, content, options) {
    content = this._prepareContent(content);
    return new Promise((resolve, reject) => {
      writer.onerror = (e) => {
        const message = e.message || 'Unable to save file.';
        reject(message);
      };
      writer.onwriteend = function() {
        resolve();
      };
      writer.write(new Blob(content, {type: options.contentType}));
    });
  }
}
