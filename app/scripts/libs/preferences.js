export class ArcPreferences {
  /* global chrome */
  constructor() {
    this._readHandler = this._readHandler.bind(this);
    this._changeHandler = this._changeHandler.bind(this);
    this._prefChanged = this._prefChanged.bind(this);
  }

  /**
   * Observers window and IPC events which makes this class work.
   */
  observe() {
    window.addEventListener('settings-read', this._readHandler);
    window.addEventListener('settings-changed', this._changeHandler);
  }
  /**
   * Stop observing window and IPC events
   */
  unobserve() {
    window.removeEventListener('settings-read', this._readHandler);
    window.removeEventListener('settings-changed', this._changeHandler);
  }

  listen() {
    chrome.storage.onChanged.addListener(this._prefChanged);
  }

  restore() {
    return new Promise((resolve) => {
      chrome.storage.local.get(null, (result) => resolve(result));
    });
  }

  /**
   * Handler for the `settings-read` custom event. Reads current settings.
   * It set's the `result` property on event's detail object with the
   * promise from calling `load()` function.
   *
   * @param {CustomEvent} e Custom event
   */
  _readHandler(e) {
    if (e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    e.detail.result = this.load();
  }
  /**
   * Loads application settings from Chrome sync storage
   * @return {Promise}
   */
  load() {
    return new Promise((resolve) => {
      chrome.storage.sync.get(null, (result) => resolve(result));
    });
  }
  /**
   * A handler for window `settings-changed` custom event.
   * Sends the intent to the main proces to update preferences.
   * @param {CustomEvent} e
   */
  _changeHandler(e) {
    if (!e.cancelable || e.defaultPrevented) {
      return;
    }
    e.preventDefault();
    e.stopPropagation();
    let {name} = e.detail;
    if (!name) {
      e.detail.result = Promise.reject(new Error('Name is not set.'));
      return;
    }
    e.detail.result = this.store(name, e.detail.value);
  }

  /**
   * Updates the data and stores it in the settings file.
   * @param {String} name Property name
   * @param {?any} value Property value
   * @return {Promise} Promise resolved when the changes has been commited to
   * the file.
   */
  store(name, value) {
    return new Promise((resolve) => {
      const data = {};
      data[name] = value;
      chrome.storage.sync.set(data, () => resolve());
    });
  }

  _prefChanged(changes, area) {
    if (area !== 'sync') {
      return;
    }
    Object.keys(changes).forEach((name) => {
      document.body.dispatchEvent(new CustomEvent('settings-changed', {
        bubbles: true,
        detail: {
          name,
          value: changes[name]
        }
      }));
    });
  }
}
