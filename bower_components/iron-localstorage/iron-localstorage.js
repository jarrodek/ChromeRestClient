Polymer({
    is: 'iron-localstorage',

    properties: {
      /**
       * localStorage item key
       */
      name: {
        type: String,
        value: ''
      },
      /**
       * The data associated with this storage.
       * If set to null item will be deleted.
       * @type {*}
       */
      value: {
        type: Object,
        notify: true
      },

      /**
       * If true: do not convert value to JSON on save/load
       */
      useRaw: {
        type: Boolean,
        value: false
      },

      /**
       * Value will not be saved automatically if true. You'll have to do it manually with `save()`
       */
      autoSaveDisabled: {
        type: Boolean,
        value: false
      },
      /**
       * Last error encountered while saving/loading items
       */
      errorMessage: {
        type: String,
        notify: true
      },

      /** True if value has been loaded */
      _loaded: {
        type: Boolean,
        value: false
      }
    },

    observers: [
      '_debounceReload(name,useRaw)',
      '_trySaveValue(autoSaveDisabled)',
      '_trySaveValue(value.*)'
    ],

    ready: function() {
      this._boundHandleStorage = this._handleStorage.bind(this);
    },

    attached: function() {
      window.addEventListener('storage', this._boundHandleStorage);
    },

    detached: function() {
      window.removeEventListener('storage', this._boundHandleStorage);
    },

    _handleStorage: function(ev) {
      if (ev.key == this.name) {
        this._load(true);
      }
    },

    _trySaveValue: function() {
      if (this._doNotSave) {
        return;
      }
      if (this._loaded && !this.autoSaveDisabled) {
        this.debounce('save', this.save);
      }
    },

    _debounceReload: function() {
      this.debounce('reload', this.reload);
    },

    /**
     * Loads the value again. Use if you modify
     * localStorage using DOM calls, and want to
     * keep this element in sync.
     */
    reload: function() {
      this._loaded = false;
      this._load();
    },

    /**
     * loads value from local storage
     * @param {boolean=} externalChange true if loading changes from a different window
     */
    _load: function(externalChange) {
      var v = window.localStorage.getItem(this.name);

      if (v === null) {
        this._loaded = true;
        this._doNotSave = true;  // guard for save watchers
        this.value = null;
        this._doNotSave = false;
        this.fire('iron-localstorage-load-empty', { externalChange: externalChange});
      } else {
        if (!this.useRaw) {
          try { // parse value as JSON
            v = JSON.parse(v);
          } catch(x) {
            this.errorMessage = "Could not parse local storage value";
            console.error("could not parse local storage value", v);
            v = null;
          }
        }
        this._loaded = true;
        this._doNotSave = true;
        this.value = v;
        this._doNotSave = false;
        this.fire('iron-localstorage-load', { externalChange: externalChange});
      }
    },

    /**
     * Saves the value to localStorage. Call to save if autoSaveDisabled is set.
     * If `value` is null or undefined, deletes localStorage.
     */
    save: function() {
      var v = this.useRaw ? this.value : JSON.stringify(this.value);
      try {
        if (this.value === null || this.value === undefined) {
          window.localStorage.removeItem(this.name);
        } else {
          window.localStorage.setItem(this.name, /** @type {string} */ (v));
        }
      }
      catch(ex) {
        // Happens in Safari incognito mode,
        this.errorMessage = ex.message;
        console.error("localStorage could not be saved. Safari incoginito mode?", ex);
      }
    }

    /**
     * Fired when value loads from localStorage.
     *
     * @event iron-localstorage-load
     * @param {{externalChange:boolean}} detail -
     *     externalChange: true if change occured in different window.
     */

    /**
     * Fired when loaded value does not exist.
     * Event handler can be used to initialize default value.
     *
     * @event iron-localstorage-load-empty
     * @param {{externalChange:boolean}} detail -
     *     externalChange: true if change occured in different window.
     */
  });