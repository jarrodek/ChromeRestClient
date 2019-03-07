/**
 * Native request options.
 */
export class RequestOptions {
  constructor(opts) {
    this.validationWarnings = [];
    opts = this.processOptions(opts);
    /**
     * When false the request object won't follow redirects.
     * @type {Boolean}
     */
    this.followRedirects = opts.followRedirects;
    /**
     * Request timeout in milliseconds
     * @type {Number}
     */
    this.timeout = opts.timeout;
    /**
     * Logger object.
     * @type {Object}
     */
    this.logger = opts.logger;
    /**
     * Hosts table.
     * Each rule must have `from` and `to` properties.
     * @type {Array<Object>s}
     */
    this.hosts = opts.hosts;
    /**
     * A limit of characters to include into the `sentHttpMessage` property
     * of the request object. 0 to disable limit. Default to 2048.
     * @type {Number}
     */
    this.sentMessageLimit = opts.sentMessageLimit;
  }
  /**
   * @return {Object} Map of options with data types
   */
  get validOptions() {
    return {
      followRedirects: Boolean,
      timeout: Number,
      logger: Object,
      hosts: Array,
      sentMessageLimit: Number
    };
  }
  /**
   * Processes user options. Removes options that has type misspatch.
   * @param {Object} opts User options
   * @return {Object} Processed options.
   */
  processOptions(opts) {
    opts = opts || {};
    this.validateOptions(opts);
    opts = this._setDefaults(opts);
    return opts;
  }
  /**
   * Validates user input options.
   * Sets `_validationErrors` and `_validationWarnings` arrays on this object
   * conteining corresponing messages.
   *
   * @param {Object} userOpts User options to check.
   */
  validateOptions(userOpts) {
    userOpts = userOpts || {};
    this._validateOptionsList(userOpts);
    this._validateLogger(userOpts);
    this._validateMessageLimit(userOpts);
  }
  /**
   * Validates passed user options for data type and names.
   * @param {Object} userOpts
   */
  _validateOptionsList(userOpts) {
    const keys = Object.keys(userOpts);
    const known = this.validOptions;
    const knownKeys = Object.keys(known);
    const unknown = [];
    const typeMissmatch = [];
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      if (knownKeys.indexOf(key) === -1) {
        unknown.push(key);
        try {
          delete userOpts[key];
        } catch (_) {}
        continue;
      }
      const expectedType = known[key].name.toLowerCase();
      const userValue = userOpts[key];
      const userType = typeof userValue;
      if (userType === 'undefined') {
        continue;
      }
      if ((expectedType === 'array' && !(userValue instanceof Array)) ||
        (userType !== expectedType && expectedType !== 'array')) {
        typeMissmatch.push({
          key,
          expectedType,
          userType
        });
        try {
          delete userOpts[key];
        } catch (_) {}
      }
    }
    if (unknown.length) {
      let message = 'Unknown option';
      if (unknown.length > 1) {
        message += 's';
      }
      message += ': ' + unknown.join(', ');
      this.validationWarnings.push(message);
    }
    if (typeMissmatch.length) {
      typeMissmatch.forEach((error) => {
        let msg = `Property ${error.key} expected to be ${error.expectedType}`;
        msg += ` but found ${error.userType}.`;
        this.validationWarnings.push(msg);
      });
    }
  }

  /**
   * Validates user option for the `logger` property.
   *
   * @param {Object} userOpts Passed user options.
   */
  _validateLogger(userOpts) {
    if (!userOpts.logger) {
      return;
    }
    const logger = userOpts.logger;
    if (!logger.log || !logger.info || !logger.warn || !logger.error) {
      this.validationWarnings.push(
        'Invalid logger passed as an option. Will use own logger.'
      );
      try {
        delete userOpts.logger;
      } catch (_) {}
    }
  }
  /**
   * Validates user option for the `logger` property.
   *
   * @param {Object} opts Passed user options.
   */
  _validateMessageLimit(opts) {
    if (!('sentMessageLimit' in opts)) {
      return;
    }
    if (opts.sentMessageLimit < 0) {
      this.validationWarnings.push(
        '"validationWarnings" cannot be negative number.'
      );
      opts.sentMessageLimit = 2048;
    }
  }

  /**
   * Creates default values for passed options.
   * @param {Object} opts
   * @return {Object}
   */
  _setDefaults(opts) {
    if (!('followRedirects' in opts)) {
      opts.followRedirects = true;
    }
    if (!('sentMessageLimit' in opts)) {
      opts.sentMessageLimit = 2048;
    }
    return opts;
  }
}
