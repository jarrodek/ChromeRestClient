(function() {
'use strict';

Polymer({
  is: 'arc-magic-variables',
  /**
   * Fired when all rules has been applied.
   *
   * @event parsed
   * @param {String|Object} Type depends on initial `value` property. Parsed String / Object.
   */
  /**
   * Fired when an error ocurred during parse.
   *
   * @event error
   * @param {String} message An error message
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
     *
     * If the value is `String` ten all magic variables will be applied to this string.
     * Otherwise magic variables will be applied to every string value of this object's most top
     * properties.
     * **No deep paths are allowed**.
     */
    value: Object,
    /**
     * Remembered groups and their values.
     * It keeps generated values for groups found in a variables e.g.:
     * ```
     * {
     *   'variable-name:1': 'generated value'
     * }
     * ```
     */
    _groups: {
      type: Object,
      value: {}
    },
    /**
     * A value for scoped rules.
     * If not set scoped rules will not be applied.
     * Only scoped rules where `project` property is equal this value will be used.
     */
    scope: {
      type: Number
    },

    environment: String
  },
  /**
   * This function should be called when groups should be cleared.
   * The program keeps the rules definition cached so you can use one element to apply magic
   * variables accross different strings/objects using group definitions. However it will never know
   * when to clear groups and get new rules definition from IDB.
   * After calling this function all cached definitions and groups values will be cleared.
   *
   * TODO: Measure inpact of this operation on performance. GC may be called to often
   * and maybe better approach is to replace definition values in the list than destroying it and
   * creating new list.
   */
  clear: function() {
    this._groups = {};
    this._setRules(null);
  },
  /**
   * Get rules from the datastore.
   * When finish rules will be available in the `rules` array.
   */
  _getRules: function() {
    if (this.rules) {
      return Promise.resolve(this.rules);
    }
    var env = this.environment || 'default';
    var db = new PouchDB('variables');
    return db.allDocs({
      // jscs:disable
      include_docs: true
      // jscs:enable
    })
    .then((r) => r.rows.filter((i) => i.doc.environment === env && i.doc.enabled === true))
    .then((rules) => {
      rules = rules.map((i) => i.doc);
      this._setRules(rules);
      return rules;
    });
  },
  /**
   * Before parsing, setup all finally defined roules.
   * Those that contains a variables in value will be omnited for further parsing.
   */
  _setupGroupRules: function() {
    if (!this.rules || (this._groups && Object.getOwnPropertyNames(this._groups).length > 0)) {
      return Promise.resolve();
    }
    var reg = /\${(([a-zA-Z0-9-_]+)(:[0-9]+)?)}/gm;
    this.rules.forEach((rule) => {
      var test = reg.test(rule.value);
      if (!test) {
        this._groups[rule.variable] = rule.value;
      }
    });
    return Promise.resolve();
  },
  /**
   * Apply magic variables to the string / object.
   *
   * This function will fire `parsed` event when finish and return a Promise with parsing results.
   * If `value` attribute is not set (or empty) while calling this function it will result success
   * response immidietly.
   *
   * @return {Promise} Fulfilled promise with parsing result.
   */
  parse: function() {
    if (!this.value) {
      //transparent
      this.fire('parsed', {
        result: this.value
      });
      return Promise.resolve(this.value);
    }
    return this._getRules()
    .then(() => this._setupGroupRules())
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
    })
    .catch((e) => {
      this.fire('error', e);
    });
  },
  /**
   * Apply magic variables to a string value
   */
  _applyString: function(str) {
    str = this._applyRandom(str);
    str = this._applyNow(str);
    str = this._applyGroups(str);
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
  /**
   * Apply build-in random function.
   */
  _applyRandom: function(str) {
    return this._apply(str, 'random');
  },
  /**
   * Apply build-in time function.
   */
  _applyNow: function(str) {
    return this._apply(str, 'now');
  },
  /**
   * Apply rules saved in the datastore
   */
  _applyGroups: function(str) {
    if (!this.rules || !this.rules.length) {
      return str;
    }
    this.rules.forEach((rule) => {
      str = this._apply(str, rule.variable, rule.value);
    });
    return str;
  },
  /**
   * Apply rule to the string.
   *
   * @param {String} str String to apply a rule to
   * @param {String} key A rule variable
   * @param {String} value A value to replace a key with. It may contain another rule. E.g.:
   * value may be: `replace me with ${random}`.
   */
  _apply: function(str, key, value) {
    key = key.replace('${', '');
    key = key.replace('}', '');
    var regGeneral = new RegExp('\\$\\{' + key + '\\}', 'gm');
    var regGroup = new RegExp('\\$\\{(' + key + ':\\d+)\\}', 'gm');
    value = this._parseValue(key, value);

    if (regGeneral.test(str)) {
      let _value;
      if (key === 'random') {
        _value = this._randomInt() + '';
      } else if (key === 'now') {
        _value = Date.now() + '';
      } else {
        _value = value;
      }
      str = str.replace(regGeneral, _value);
    }
    if (regGroup.test(str)) {
      regGroup.lastIndex = 0;
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
   * Parse value to string value without any variables.
   *
   * @param {String} orygKey Original key to check for recursive loops. It will not prevents from
   * deep recurvive loops thought.
   * @param {String} value A value to parse
   */
  _parseValue: function(orygKey, value) {
    var reg = /\${(([a-zA-Z0-9-_]+)(:[0-9]+)?)}/gm;
    var test = reg.test(value);
    if (test) {
      reg.lastIndex = 0;
      while (true) {
        let matches = reg.exec(value);
        if (!matches) {
          break;
        }
        let groupKey = matches[1];
        let key = matches[2];
        if (key === orygKey) {
          value = value.replace(matches[0], '[recursive]');
          continue;
        }
        let _value = this._getGroupValue(groupKey, key, value, !!matches[3]);
        value = this._apply(value, key, _value);
      }
    }
    return value;
  },
  /**
   * Get a value for a group.
   * Looks for a cached value and generate it if not set.
   *
   * @param {String} groupKey A group id key e.g. `key-name:1`
   * @param {String} key An original key. If key equals `random` or `now` it will use build
   * in function.
   * @param {String} defaultValue A value if not found.
   * @param {Boolean} dontCache True if the value should not use cache.
   * @param {String} A generated / cached value for given groupKey.
   */
  _getGroupValue: function(groupKey, key, defaultValue, dontCache) {
    var value;
    if ((groupKey in this._groups) && !dontCache) {
      value = this._groups[groupKey];
    } else {
      if (key === 'random') {
        value = this._randomInt() + '';
        dontCache = true;
      } else if (key === 'now') {
        value = Date.now() + '';
        dontCache = true;
      } else {
        value = defaultValue;
      }
      if (!dontCache) {
        this._groups[groupKey] = value;
      }
    }
    return value;
  },
  /**
   * Returns a random <code>int</code> between 0 (inclusive) and
   * <code>Number.MAX_SAFE_INTEGER</code> (exclusive) with roughly equal probability of
   * returning any particular <code>int</code> in this range.
   */
  _randomInt: function() {
    // "|0" forces the value to a 32 bit integer.
    //return (Math.floor(Math.random() * Number.MAX_SAFE_INTEGER)) | 0;
    return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
  }
});
})();
