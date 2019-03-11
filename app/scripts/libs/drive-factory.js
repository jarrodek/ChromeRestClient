export class DriveFactory {
  /* global chrome */
  constructor() {
    this._dataSaveHandler = this._dataSaveHandler.bind(this);
    this._listAppFoldersHandler = this._listAppFoldersHandler.bind(this);
    this._getFileHandler = this._getFileHandler.bind(this);
    /**
     * List of cached folders created by the app.
     */
    this.cachedFolders = undefined;

    this.mime = 'application/restclient+data';
    this.fileDescription = 'Advanced REST client data export file.';
    this.fileType = 'application/json';
  }

  observe() {
    window.addEventListener('google-drive-data-save', this._dataSaveHandler);
    window.addEventListener('google-drive-list-app-folders', this._listAppFoldersHandler);
    window.addEventListener('google-drive-get-file', this._getFileHandler);
  }

  /**
   * Handler for web `google-drive-data-save` event.
   * @param {CustomEvent} e
   */
  _dataSaveHandler(e) {
    e.preventDefault();
    let {content, file, options, id} = e.detail;
    if (!options) {
      options = {};
    }
    const meta = {
      name: file
    };
    if (options.parents && options.parents instanceof Array) {
      const parents = [];
      options.parents.forEach((item) => {
        if (!item) {
          return;
        }
        if (typeof item === 'string') {
          if (item.toLowerCase() === 'my drive') {
            item = {id: 'root', name: item};
          }
          parents.push(item);
        } else if (typeof item.name === 'string') {
          if (item.name.toLowerCase() === 'my drive') {
            item = Object.assign({}, item);
            item.id = 'root';
          }
          parents.push(item);
        }
      });
      if (parents.length) {
        meta.parents = parents;
      }
    }
    e.detail.result = this.put({
      id,
      meta,
      type: options.contentType,
      body: content
    });
  }

  auth(interactive) {
    if (typeof interactive !== 'boolean') {
      interactive = true;
    }
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({interactive}, (authToken) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }
        if (!authToken) {
          reject(new Error('User canceled'));
          return;
        }
        resolve(authToken);
      });
    });
  }

  put(config) {
    const {authToken, id} = config;
    const meta = this._createResource(config);
    const media = this._createMedia(config);
    if (id) {
      return this.update(id, meta, media, authToken);
    } else {
      return this.create(meta, media, authToken);
    }
  }

  /**
   * Creates media data used by this library
   * @param {Object} config Passed user configuration
   * @return {Object} Resource object
   */
  _createMedia(config) {
    let {body, type} = config;
    if (typeof body !== 'string') {
      body = JSON.stringify(body);
    }
    const media = {
      mimeType: type || this.fileType,
      body
    };
    return media;
  }
  /**
   * Creates resource data for Drive file.
   * @param {Object} config Passed user configuration
   * @return {Object} Resource object
   */
  _createResource(config) {
    let {meta, type} = config;
    if (!meta) {
      meta = {};
    }
    if (!meta.description && this.fileDescription) {
      meta.description = this.fileDescription;
    }
    if (!meta.mimeType) {
      meta.mimeType = type || this.fileType;
    }
    return meta;
  }

  _listAppFoldersHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    if (this.cachedFolders) {
      e.detail.result = Promise.resolve(this.cachedFolders);
      return;
    }
    let opts = e.detail;
    if (!opts) {
      opts = {};
    }
    const interactive = typeof opts.interactive === 'undefined' ? true : opts.interactive;
    e.detail.result = this.listAppFolders(interactive)
    .then((result) => {
      const folders = [];
      if (result.files) {
        result.files.forEach((item) => {
          folders[folders.length] = {
            id: item.id,
            name: item.name
          };
        });
      }
      this.cachedFolders = folders;
      return folders;
    });
  }
  /**
   * Lists folders in Google Drive.
   * With regular set of authorization scopes this function lists folders creaded by this application.
   * With additional scopes it will list all folders.
   * ARC uses default set of scopes meaning it will only list folders
   * previously created by it (as ling as OAuth client id is the same).
   * @param {Boolean} interactive Perform interactive authorization. When false it will not bring
   * oauth screen when application is not authorized.
   * @return {Promise} Promise resolved to Drive response.
   */
  listAppFolders(interactive) {
    return this.auth({interactive})
    .then((token) => {
      if (token) {
        return this._listAppFolders(token);
      }
    });
  }

  _listAppFolders(token) {
    const params = {
      q: 'trashed = false and mimeType="application/vnd.google-apps.folder"',
      orderBy: 'modifiedTime desc'
    };
    let url = 'https://www.googleapis.com/drive/v3/files?';
    Object.keys(params).forEach((key) => {
      url += key + '=' + encodeURIComponent(params[key]) + '&';
    });
    const headers = new Headers();
    headers.set('authorization', 'Bearer ' + token);
    headers.set('accept', 'application/json');
    const init = {
      headers,
      method: 'GET'
    };
    return fetch(url, init)
    .then((response) => response.json());
  }

  /**
   * Creates a Google Drive File.
   *
   * If `config.resource.mimeType` is not set and `drive.file.mime` is set then
   * `this.mime` is used instead.
   *
   * This script will automatically set file thumbnail if not set
   * (`config.resource.contentHints.thumbnail` object value).
   *
   * @param {Object} resource File metadata.
   * @param {Object} media A data to send with content type.
   * - {String} `mimeType` - A media mime type
   * - {String} `body` - A content to save.
   * @param {String} accessToken Authorization token to use.
   * @return {Promise} Promise resolved to Drive response object.
   */
  create(resource, media, accessToken) {
    if (!resource.mimeType && this.mime) {
      resource.mimeType = this.mime;
    }
    let createdParents;
    let token;
    let p;
    if (accessToken) {
      p = Promise.resolve(accessToken);
    } else {
      p = this.auth(true);
    }
    return p
    .then((accessToken) => {
      token = accessToken;
      let p;
      if (resource.parents && resource.parents.length) {
        p = this.createParents(resource.parents, accessToken);
      } else {
        p = Promise.resolve();
      }
      return p;
    })
    .then((parents) => {
      if (!parents || !parents.length) {
        delete resource.parents;
      }
      if (parents) {
        createdParents = parents;
        resource.parents = parents.map((item) => item.id);
      }
      return this._initializeSession(token, resource)
      .then((url) => this._upload(token, url, media.body, media.mimeType))
      .then((result) => {
        if (createdParents) {
          result.parents = createdParents;
        }
        return result;
      });
    });
  }
  /**
   * Update a file on Google Drive.
   *
   * @param {String} fileId A Google Drive file ID.
   * @param {Object} resource The same as for `create` function.
   * @param {Object} media The same as for `create` function.
   * @param {?String} accessToken Access token to use.
   * @return {Promise} Fulfilled promise with file properties (the response).
   */
  update(fileId, resource, media, accessToken) {
    if (!resource.mimeType && this.mime) {
      resource.mimeType = this.mime;
    }
    let p;
    if (accessToken) {
      p = Promise.resolve(accessToken);
    } else {
      p = this.auth(true);
    }
    return p
    .then((accessToken) => {
      return this._initializeSession(accessToken, resource, fileId)
      .then((url) => this._upload(accessToken, url, media.body, media.mimeType));
    });
  }
  /**
   * Initializes resumable session to upload a file to Google Drive.
   * @param {String} accessToken Authorization token
   * @param {?Object} meta Optional file meta data to send with the request
   * @param {?String} fileId If it is the update request, this is file id to update
   * @return {Promise}
   */
  _initializeSession(accessToken, meta, fileId) {
    const headers = new Headers();
    headers.set('authorization', 'Bearer ' + accessToken);
    headers.set('content-type', 'application/json; charset=UTF-8');
    const body = meta ? JSON.stringify(meta) : undefined;
    const init = {
      headers,
      body
    };
    let url = 'https://www.googleapis.com/upload/drive/v3/files';
    if (fileId) {
      url += `/${fileId}?uploadType=resumable`;
      init.method = 'PATCH';
    } else {
      url += '?uploadType=resumable';
      init.method = 'POST';
    }
    let error = false;
    let location;
    return fetch(url, init)
    .then((response) => {
      if (response.status >= 400) {
        error = true;
        return response.text();
      }
      location = response.headers.get('location');
    })
    .then((body) => {
      if (error) {
        let msg = 'Could not initialize Drive upload session. Reason: ';
        msg += body;
        throw new Error(msg);
      }
      return location;
    });
  }
  /**
   * Uploads the file to the upload endpoint.
   * The `url` is received from the Drive upload location of the upload for
   * the resource.
   * @param {String} accessToken
   * @param {String} url
   * @param {String} body
   * @param {String} mimeType
   * @return {Promise}
   */
  _upload(accessToken, url, body, mimeType) {
    const headers = new Headers();
    headers.set('authorization', 'Bearer ' + accessToken);
    headers.set('content-type', mimeType);
    const init = {
      method: 'PUT',
      body,
      headers
    };
    let error = false;
    return fetch(url, init)
    .then((response) => {
      if (response.status >= 400) {
        error = true;
      }
      return response.json();
    })
    .then((body) => {
      if (error) {
        console.warn(error);
        throw new Error(JSON.stringify(body));
      }
      return body;
    });
  }
  /**
   * Creates a list of folders in Google Drive.
   * It expects the input list to be array of `string` as a list of names of
   * folders to create or array of objects with `name` and optional `id` properties.
   * If the item on the array already have `id` the folder won't be created.
   *
   * The resulting list will contain list of objects with `name` and `id`.
   *
   * @param {Array<String>|Array<Object>} parents
   * @param {?String} accessToken Access token to use
   * @return {Promise<Array<Object>>}
   */
  createParents(parents, accessToken) {
    if (!parents || !parents.length) {
      return Promise.reject(new Error('The parents argument not set.'));
    }
    parents = this._normalizeParents(parents);
    if (!parents.length) {
      return Promise.resolve([]);
    }
    let p;
    if (accessToken) {
      p = Promise.resolve(accessToken);
    } else {
      p = this.auth(true);
    }
    return p
    .then((accessToken) => {
      return this._createParents(parents, accessToken, []);
    });
  }

  _normalizeParents(parents) {
    const result = [];
    parents.forEach((item) => {
      if (typeof item === 'string') {
        if (name.toLowerCase() === 'my drive') {
          result[result.length] = {id: 'root'};
        }
      } else {
        if (!item.name && !item.id) {
          return;
        }
        result[result.length] = item;
      }
    });
    return result;
  }

  _createParents(parents, accessToken, result) {
    const parent = parents.shift();
    if (!parent) {
      return Promise.resolve(result);
    }
    if (parent.id) {
      result.push(parent);
      return this._createParents(parents, accessToken, result);
    }
    return this.createFolder(parent.name, accessToken)
    .then((id) => {
      parent.id = id;
      result.push(parent);
      if (!this.cachedFolders) {
        this.cachedFolders = [];
      }
      this.cachedFolders.push(parent);
      return this._createParents(parents, accessToken, result);
    });
  }
  /**
   * Creates a Google Drive folder.
   *
   * @param {String} name Folder name
   * @param {?String} accessToken Access token to use
   * @return {Promise} Promise resolved to created folder ID.
   */
  createFolder(name, accessToken) {
    let p;
    if (accessToken) {
      p = Promise.resolve(accessToken);
    } else {
      p = this.auth(true);
    }
    return p.then((accessToken) => this._createFolder(name, accessToken));
  }

  _createFolder(name, accessToken) {
    const headers = new Headers();
    headers.set('authorization', 'Bearer ' + accessToken);
    headers.set('content-type', 'application/json');
    const mimeType = 'application/vnd.google-apps.folder';
    const body = JSON.stringify({
      name,
      mimeType
    });
    const init = {
      method: 'POST',
      body,
      headers
    };
    const url = 'https://content.googleapis.com/drive/v3/files?alt=json';
    return fetch(url, init)
    .then((response) => response.json());
  }

  _getFileHandler(e) {
    const {id} = e.detail;
    e.detail.result = this.getFile(id);
  }
  /**
   * Downloads the file data by given ID.
   * @param {String} id File ID
   * @return {Promise} Promise resolved to file's string data.
   */
  getFile(id) {
    return this.auth(true)
    .then((accessToken) => this._downloadFile(accessToken, id));
  }

  _downloadFile(accessToken, id) {
    const headers = new Headers();
    headers.set('authorization', 'Bearer ' + accessToken);
    const init = {
      method: 'GET',
      headers
    };
    const url = `https://www.googleapis.com/drive/v3/files/${id}?alt=media`;
    let isError = false;
    return fetch(url, init)
    .then((response) => {
      if (response.status >= 400) {
        isError = true;
      }
      return response.json();
    })
    .then((body) => {
      if (isError) {
        try {
          let tmp = JSON.parse(body);
          if (tmp.error) {
            tmp = tmp.error;
          }
          if (tmp.message) {
            body = (tmp.code ? (String(tmp.code) + ': ') : '') + tmp.message;
          }
        } catch (_) {}
        throw new Error(body);
      } else {
        return body;
      }
    });
  }
}
