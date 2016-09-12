Polymer({
  is: 'request-timings',
  properties: {
    /**
     * A timings object as described in HAR 1.2 spec.
     */
    timings: {
      type: Object
    },
    /**
     * Calculated full time of the request and response
     */
    fullTime: {
      type: Number,
      readOnly: true
    },
    // Time required to establish the connection
    connect: {
      type: Number,
      readOnly: true
    },
    // Time of receiving data from the remote machine
    receive: {
      type: Number,
      readOnly: true
    },
    // Time to send data to the remote machine.
    send: {
      type: Number,
      readOnly: true
    },
    // Wait time for first bute to arrive.
    wait: {
      type: Number,
      readOnly: true
    }
  },

  observers: [
    '_update(timings.*)'
  ],

  detached: function() {
    this._setFullTime(0);
    this._setConnect(0);
    this._setReceive(0);
    this._setSend(0);
    this._setWait(0);
  },

  _update: function(record) {
    if (!record.base) {
      record.base = {}; // will be set to 0
    }
    var fullTime = 0;
    var connect = Number(record.base.connect);
    var receive = Number(record.base.receive);
    var send = Number(record.base.send);
    var wait = Number(record.base.wait);
    if (connect !== connect || connect < 0) {
      connect = 0;
    }
    if (receive !== receive || receive < 0) {
      receive = 0;
    }
    if (send !== send || send < 0) {
      send = 0;
    }
    if (wait !== wait || wait < 0) {
      wait = 0;
    }
    fullTime += connect + receive + send + wait;
    this._setFullTime(fullTime);
    this._setConnect(connect);
    this._setReceive(receive);
    this._setSend(send);
    this._setWait(wait);
  },

  round: function(value, power) {
    value = Number(value);
    if (value !== value) {
      return 'unknown';
    }
    power = +power;
    if (power === 0) {
      return value;
    }
    if (!power || power !== power) {
      power = 4;
    }
    power = Math.pow(10, power);
    return Math.round(value * power) / power;
  },

  computeStart: function(...values) {
    var sum = 0;
    values.forEach((i) => sum += i);
    return sum;
  }
});
