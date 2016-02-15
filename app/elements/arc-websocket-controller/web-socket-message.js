'use strict';

class WebSocketMessage {

  constructor(opts) {
    let msg = opts.message;
    if ((msg instanceof Blob) || (msg instanceof ArrayBuffer)) {
      msg = '[Binnary data]';
    }
    /**
     * A message sent to / received from the server.
     *
     * @type {String|ArrayBuffer|Blob}
     */
    this.message = msg || 'empty';
    /**
     * A direction of the message. Either "in" or "out".
     *
     * @type {enum:["in","out"]}
     */
    this.direction = opts.direction;
    /**
     * An event time.
     *
     * @type {Date}
     */
    this._time = undefined;
    if (opts.time) {
      this.time = opts.time;
    } else {
      this.time = new Date();
    }

  }

  set time(time) {

    Object.ensureDate(this, '_time', time);
  }

  get time() {
    return this._time;
  }

  toJSON() {
    var copy = Object.assign({}, this);
    var keys = Object.keys(copy);
    var under = keys.filter((key) => key.indexOf('_') === 0);
    under.forEach((key) => {
      let realKey = key.substr(1);
      copy[realKey] = copy[key];
      delete copy[key];
    });
    copy.time = copy.time.getTime();
    return copy;
  }

}
