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
    }
  },

  _payloadChanged: function() {
    var payload = this.payload;
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
    var ct = arc.app.headers.getContentType(this.headers);
    if (ct) {
      this._setParsedMode(ct);
    }
  },
  /** Display blob. Most commonly it will be image data */
  _displayBlob: function(payload) {

  },
  /** Display parsed JSON */
  _displayJSON: function(payload) {
    this._setRaw(JSON.stringify(payload));
    this.$.jsonViewer.json = payload;
  },

  _toggleTextWrap: function(e) {
    if (e.target.active) {
      this.$.rawContent.classList.add('wrap');
    } else {
      this.$.rawContent.classList.remove('wrap');
    }
  },
  /**
   *
   */
  _clipboardCopy: function() {
    this.fire('clipboard-write', {
      data: this.raw
    });
  },

  _saveFile: function() {
    var params = {
      'data': null,
      'content-type': null
    };
    throw 'implement me';
    this.fire('save-file', params);
  }
});
