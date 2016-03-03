Polymer({
  is: 'arc-magic-variables',
  /**
   * Fired when all rules has been applied.
   *
   * @event parsed
   * @param {String|Object} thesame type as `value` property.
   */
  properties: {
    /**
     * List of defined rules retreived from the IDB.
     */
    rules: {
      type: Array,
      value: [],
      readOnly: true
    },
    /**
     * A value to apply magic variables.
     * If not String then magic variables will be applied to every string value of this object.
     * No deep paths are allowed.
     */
    value: Object,
    /**
     * Remembered groups and their values.
     * It keeps generated values for groups found in a variables e.g.:
     * {
     *   'variable-name:1': 'generated value'
     * }
     */
    _groups: {
      type: Object,
      value: {}
    }
  },
  /**
   * This function should be called when groups should be cleared.
   */
  clear: function() {
    this._groups = {};
  },
  /**
   * Get rules from the datastore.
   * When finish rules will be available in the `rules` array.
   */
  _getRules: function() {
    this.$.variableModel.query()
    .then((rules) => {
      this.set('rules', rules);
    });
  },

  parse: function() {
    if (!this.value) {
      //transparent
      return Promise.resolve(this.value);
    }
    return this._getRules()
    .then(() => {
      if (typeof this.value === 'string') {
        return this._applyString(this.value);
      } else {
        return this._applyObject(this.value);
      }
    })
    .then((result) => {
      this.fire('parsed', {
        result: result
      });
      return result;
    });
  },
  /**
   * Apply magic variables to a string value
   */
  _applyString: function(str) {
    str = this._applyRandom(str);
    str = this._applyNow(str);
    return str;
  },
  /**
   * Apply magic variables to an object.
   */
  _applyObject: function(obj) {
    var names = Object.getOwnPropertyNames(obj);
    names.forEach((value) => {
      if (typeof value === 'string') {
        value = this._applyString(value);
        return value;
      }
    });
  },

  _applyRandom: function(str) {
    return this._apply(str, 'random');
  },

  _applyNow: function(str) {
    return this._apply(str, 'now');
  },

  _apply: function(str, key, value) {
    var regGeneral = new RegExp('\\$\\{' + key + '\\}', 'gm');
    var regGroup = new RegExp('\\$\\{(' + key + ':\\d+)\\}', 'gm');
    if (regGeneral.test(str)) {
      let _value;
      if (key === 'random') {
        _value = this._randomInt() + '';
      } else if (key === 'now') {
        _value = Date.now() + '';
      }
      str = str.replace(regGeneral, _value);
    }
    if (regGroup.test(str)) {
      while (true) {
        let matches = regGroup.exec(str);
        if (!matches) {
          break;
        }
        let groupKey = matches[1];
        let _value;
        if (groupKey in this._groups) {
          _value = this._groups[groupKey];
        } else {
          if (key === 'random') {
            _value = this._randomInt() + '';
          } else if (key === 'now') {
            _value = Date.now() + '';
          } else {
            _value = value;
          }
          this._groups[groupKey] = _value;
        }
        str = str.replace(matches[0], _value);
      }
    }
    return str;
  },
  /**
   * Returns a random <code>int</code> between 0 (inclusive) and
   * <code>Number.MAX_SAFE_INTEGER</code> (exclusive) with roughly equal probability of
   * returning any particular <code>int</code> in this range.
   */
  _randomInt: function() {
    // "|0" forces the value to a 32 bit integer.
    return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) | 0;
  }
});
