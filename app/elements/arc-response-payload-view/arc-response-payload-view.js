(function() {
'use strict';
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
    raw: String,
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
      value: true,
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
    },
    // True if the received data are binary.
    isBinary: {
      type: Boolean,
      value: false,
      readOnly: true,
      observer: '_tabsChanged'
    },
    // An element which should be searched for text.
    _textSearch: {
      type: HTMLElement,
      value: function() {
        return this.$.rawContent;
      }
    },

    contentPreview: Boolean
  },

  observers: [
    '_selectedTabChanged(selectedTab)',
    '_rawChanged(raw)',
    '_contentPreviewChanged(contentPreview)'
  ],

  behaviors: [
    ArcBehaviors.TextSearchBehavior
  ],

  attached: function() {
    this.listen(window, 'message', '_onExternalMessage');
  },

  detached: function() {
    this.unlisten(window, 'message', '_onExternalMessage');
  },

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
    this.contentPreview = false;
    if (this.isAttached) {
      arc.app.analytics.sendEvent('Response payload', 'Tab switched', tabName);
    }
  },

  _resetTabs: function() {
    // this._setIsRaw(false);
    this._setIsParsed(false);
    this._setIsJson(false);
    this._setIsXml(false);
    this._setIsImage(false);
    this._setIsEmpty(false);
    this._setIsBinary(false);
    this._setParsedMode(undefined);
    this.contentPreview = false;
  },

  _payloadChanged: function() {
    this._resetTabs();
    this._setParsedMode(undefined);
    var payload = this.payload;
    if (payload === null || payload === false) {
      this._displayJSON(payload);
      return;
    }
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
    // this._setRaw(payload);
    // this._setIsRaw(true);

    var ct = arc.app.headers.getContentType(this.headers);
    if (ct) {
      if (ct.indexOf('xml') !== -1) {
        this.$.xmlViewer.xml = payload;
        this._setIsXml(true);
        this.selectedTab = 3;
        this._tabsChanged();
      } else {
        this._setParsedMode(ct);
        this._setIsParsed(true);
        this.selectedTab = 1;
        this._tabsChanged();
      }
    }
  },
  /** Display blob. Most commonly it will be image data */
  _displayBlob: function(payload) {
    var ct = arc.app.headers.getContentType(this.headers);
    if (ct && ct.indexOf('image') === -1) {
      // This is a binary file.
      this._setIsBinary(true);
      this.selectedTab = 5;
      this._tabsChanged();
      return;
    }

    this._setIsImage(true);

    this.selectedTab = 4;
    this._tabsChanged();
    this.$.imageViewer.blob = payload;

    // this._setIsRaw(true);
    // var fr = new FileReader();
    // fr.onloadend = (e) => {
    //   this._setRaw(e.target.result);
    //   this._setIsRaw(true);
    // };
    // fr.onerror = () => {
    //   this._setRaw('Unable to read binnary data as string.');
    //   this._setIsRaw(true);
    // };
    // fr.readAsText(payload);
  },
  /** Display parsed JSON */
  _displayJSON: function(payload) {
    // if (!payload) {
    //   return;
    // }
    // if (typeof payload === 'string') {
    //   if (payload !== this.raw) {
    //     this._setRaw(payload);
    //   }
    // } else {
    //   this._setRaw(JSON.stringify(payload));
    // }
    // this._setIsRaw(true);
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
  _clipboardCopy: function(e) {
    e = Polymer.dom(e);
    var source = e.localTarget.dataset.source;
    var data = '';
    if (source === 'json') {
      data = JSON.stringify(this.$.jsonViewer.json, null, 2);
    } else {
      data = this.raw;
    }
    this.fire('clipboard-write', {
      data: data
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
  },

  _searchBarOpenedChanged: function(e) {
    this._searchInputChanged(e);
  },

  // search in response tab
  _searchInputChanged: function(e) {
    if (e.detail.lastTarget && e.detail.lastTarget !== this) {
      return;
    }
    var elm = null;
    switch (this.selectedTab) {
      case 0:
        //raw
        elm = this;
        break;
      case 1:
        //parsed
        elm = this.$.prism;
        break;
      case 2:
        //json
        elm = this.$.jsonViewer;
        break;
      case 3:
        //xml
        elm = this.$.xmlViewer;
        break;
    }
    if (elm) {
      elm.cleanMarked();
      elm.mark(e.detail.value);
      let marked = elm.markedCount;
      this.fire('iron-signal', {
        name: 'search-mark-count',
        data: {
          count: marked,
          searchTarget: this
        }
      });
    }
  },

  _searchPositionChanged: function(e) {
    if (e.detail.searchTarget && e.detail.searchTarget !== this) {
      return;
    }
    var pos = e.detail.position;
    var elm = null;
    switch (this.selectedTab) {
      case 0:
        elm = this;
        break;
      case 1:
        elm = this.$.prism;
        break;
      case 2:
        //json
        elm = this.$.jsonViewer;
        break;
      case 3:
        elm = this.$.xmlViewer;
        break;
    }
    if (elm) {
      elm.clearMarked();
      elm.setMarked(pos);
    }
  },

  _rawChanged: function(raw) {
    this._setParsedMode(undefined);
    if (!raw) {
      this.$.rawContent.innerHTML = '';
    } else {
      this.$.rawContent.innerHTML = PayloadParser.htmlEscape(raw);
    }
  },
  // Handler for RAW preview click
  _togglePreviewResponse: function() {
    this.contentPreview = !this.contentPreview;
  },
  // Handler for `this.contentPreview` change.
  _contentPreviewChanged: function(val) {
    if (!this.isAttached) {
      return;
    }
    if (val) {
      this._openResponsePreview();
    } else {
      this._closeResponsePreview();
    }
  },
  // Opens response preview in new layer
  _openResponsePreview: function() {
    if (!this.isAttached) {
      return;
    }
    this.$.webView.contentWindow.postMessage({
      'rawResponse': this.raw
    }, '*');
    // this.$.webView.removeAttribute('hidden');
    // this.$.rawContent.setAttribute('hidden', true);
    // this.$.prism.setAttribute('hidden', true);
  },
  // Closes response preview
  _closeResponsePreview: function() {
    if (!this.isAttached) {
      return;
    }
    // this.$.webView.setAttribute('hidden', true);
    this.$.webView.contentWindow.postMessage({
      'cleanUp': true
    }, '*');
    // this.$.rawContent.removeAttribute('hidden');
    // this.$.prism.removeAttribute('hidden');
  },
  // a message received from the external page using window.postMessage.
  _onExternalMessage: function(e) {
    if (!this.isAttached) {
      return;
    }
    if (!e || !e.data) {
      return;
    }
    if ('preview-window-height' in e.data) {
      let height = e.data['preview-window-height'];
      if (!height) {
        this.$.webView.style.height = 'auto';
      } else {
        this.$.webView.style.height = e.data['preview-window-height'] + 'px';
      }
    }
  },

  _codeForceMenuAction: function(e) {
    var action = e.target.selectedItem.dataset.action;
    e.target.selected = -1;
    if (!action) {
      return;
    }
    var gaLabel = '';
    switch (action) {
      case 'json':
        this._displayJSON(this.raw);
        gaLabel = 'Force json';
        break;
      case 'xml':
        this.$.xmlViewer.xml = this.raw;
        this._setIsXml(true);
        this.selectedTab = 3;
        this._tabsChanged();
        gaLabel = 'Force xml';
        break;
    }
    if (gaLabel) {
      arc.app.analytics.sendEvent('Response view', 'Payload preview', gaLabel);
    }
  }
});
})();
