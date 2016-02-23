'use strict';

Polymer({
  is: 'url-input-editor',
  properties: {
    url: {
      type: String,
      notify: true
    },
    searchTerm: String
  },

  _contextMenuAction: function(e) {
    var action = e.target.selectedItem.dataset.action;
    if (!action) {
      return;
    }
    var gaLabel = '';
    switch (action) {
      case 'encParamsAction':
        this.encodeParameters();
        gaLabel = 'Encode parameters';
        break;
      case 'decParamsAction':
        this.decodeParameters();
        gaLabel = 'Decode parameters';
        break;
      case 'replAmpAction':
        this.replaceAmp();
        gaLabel = 'Replace & with ;';
        break;
      case 'replSemiAction':
        this.replaceSemicolon();
        gaLabel = 'Replace ; with &';
        break;
      default:
        console.warn('Unknown action: %s', action);
    }
    if (gaLabel) {
      //category: 'Request view'
      this.fire('ga-event', {
        'action': 'URL widget context menu action',
        'label': gaLabel
      });
    }
  },
  /**
   * HTTP encode query parameters
   */
  encodeParameters: function() {
    this._decodeEncode('encode');
  },
  /**
   * HTTP decode query parameters
   */
  decodeParameters: function() {
    this._decodeEncode('decode');
  },
  /**
   * HTTP encode or decode query parameters depending on [type].
   */
  _decodeEncode: function(type) {
    var uri = new URI(this.url);
    var params = uri.search(true);
    var isEncode = type === 'encode';
    var result = {};
    URI.escapeQuerySpace = true;
    for (let key in params) {
      if (!key || key.trim() === '') {
        continue;
      }
      let value = params[key];
      key = isEncode ? URI.encodeQuery(key) : URI.decodeQuery(key);
      value = isEncode ? URI.encodeQuery(value) : URI.decodeQuery(value);
      if (key in result) {
        if (result[key] instanceof Array) {
          result[key].push(value);
        } else {
          result[key] = [result[key]];
          result[key].push(value);
        }
      } else {
        result[key] = value;
      }
    }
    uri.search(result);
    this.set('url', uri.toString());
  },
  /**
   * Replace `&` with `;`
   */
  replaceAmp: function() {
    this._replaceQueryDelim('&', ';');
  },
  /**
   * Replace `;` with `&`
   */
  replaceSemicolon: function() {
    this._replaceQueryDelim(';', '&');
  },
  /**
   * Replace [replace] with [replacement].
   */
  _replaceQueryDelim: function(replace, replacement) {
    var reg = new RegExp(replace, 'gim');
    var url = this.url.replace(reg, replacement);
    this.set('url', url);
  }
});
