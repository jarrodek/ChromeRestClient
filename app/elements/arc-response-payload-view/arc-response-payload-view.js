(function() {
Polymer({
  is: 'arc-response-payload-view',
  properties: {
    payload: {
      type: Object,
      observer: '_payloadChanged'
    },
    headers: {
      type: Array
    },
    selectedTab: {
      type: Number,
      value: 0
    },
    /**
     * Raw tab data.
     */
    raw: {
      type: String,
      readOnly: true
    },
    /**
     * If set, the parsed tab should be visible,
     * and the CodeMirror parser will parce the content of `this.raw`.
     */
    parsedMode: {
      type: String,
      readOnly: true
    },
    /**
     * True if "raw" tab is shown.
     *
     * @type {Boolean}
     */
    isRaw: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },
    /**
     * True if "parsed" tab is shown.
     *
     * @type {Boolean}
     */
    isParsed: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },
    /**
     * True if "json" tab is shown.
     *
     * @type {Boolean}
     */
    isJson: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },
    /**
     * True if "xml" tab is shown.
     *
     * @type {Boolean}
     */
    isXml: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },
    /**
     * True if "image" tab is shown.
     *
     * @type {Boolean}
     */
    isImage: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },

    isEmpty: {
      type: Boolean,
      value: true,
      readOnly: true
    }
  },

  observers: [
    '_selectedTabChanged(selectedTab)'
  ],

  _selectedTabChanged: function(selectedTab) {
    var tabName;
    switch (selectedTab) {
      case 0:
        tabName = 'Raw tab';
        break;
      case 1:
        tabName = 'Parsed tab';
        break;
      case 2:
        tabName = 'JSON tab';
        break;
      case 3:
        tabName = 'XML tab';
        break;
      case 4:
        tabName = 'Image tab';
        break;
    }
    if (this.isAttached) {
      arc.app.analytics.sendEvent('Response payload', 'Tab switched', tabName);
    }
  },

  _resetTabs: function() {
    this._setIsRaw(false);
    this._setIsParsed(false);
    this._setIsJson(false);
    this._setIsXml(false);
    this._setIsImage(false);
    this._setIsEmpty(false);
    this._setParsedMode(undefined);
  },

  _payloadChanged: function() {
    this._resetTabs();
    var payload = this.payload;
    if (!payload) {
      this._setIsEmpty(true);
      return;
    }
    if (typeof payload === 'string') {
      this._displayString(payload);
    } else if (payload instanceof Blob) {
      this._displayBlob(payload);
    } else {
      this._displayJSON(payload);
    }
  },
  /** Parse response as string */
  _displayString: function(payload) {
    this._setRaw(payload);
    this._setIsRaw(true);

    var ct = arc.app.headers.getContentType(this.headers);
    if (ct) {
      if (ct.indexOf('xml') !== -1) {
        this.$.xmlViewer.xml = payload;
        this._setIsXml(true);
        this.selectedTab = 3;
        this._tabsChanged();
      } else {
        // console.log('SETTING UP PARSE MODE', ct);
        this._setParsedMode(ct);
        this._setIsParsed(true);
        this.selectedTab = 1;
        this._tabsChanged();
      }
    }
  },
  /** Display blob. Most commonly it will be image data */
  _displayBlob: function(payload) {
    this._setIsImage(true);

    this.selectedTab = 4;
    this._tabsChanged();
    this.$.imageViewer.blob = payload;

    var fr = new FileReader();
    fr.onloadend = (e) => {
      this._setRaw(e.target.result);
      this._setIsRaw(true);
    };
    fr.onerror = () => {
      this._setRaw('Unable to read binnary data as string.');
      this._setIsRaw(true);
    };
    fr.readAsText(payload);
  },
  /** Display parsed JSON */
  _displayJSON: function(payload) {
    if (!payload) {
      return;
    }
    this._setRaw(JSON.stringify(payload));
    this._setIsRaw(true);
    this._setIsJson(true);

    this.selectedTab = 2;
    this._tabsChanged();
    this.$.jsonViewer.json = payload;
  },

  _toggleTextWrap: function(e) {
    if (e.target.active) {
      this.$.rawContent.classList.add('wrap');
      arc.app.analytics.sendEvent('Response payload', 'Content action', 'Wrap text');
    } else {
      this.$.rawContent.classList.remove('wrap');
      arc.app.analytics.sendEvent('Response payload', 'Content action', 'Unwrap text');
    }
  },
  /**
   * Save to clipboard.
   */
  _clipboardCopy: function() {
    this.fire('clipboard-write', {
      data: this.raw
    });
    arc.app.analytics.sendEvent('Response payload', 'Content action', 'Copy to clipboard');
  },

  _saveFile: function() {
    // arc-request-controller listen to this event
    this.fire('save-file');
    arc.app.analytics.sendEvent('Response payload', 'Content action', 'Save as file');
  },

  _tabsChanged: function() {
    this.$.tabs.notifyResize();
  }
});
})();
