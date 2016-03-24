Polymer({
  is: 'date-time',
  properties: {
    /**
     * A date object to display
     */
    date: {
      type: Date,
      observer: '_update'
    },
    /**
     * A string to display
     */
    display: String,
    /**
     * The representation of the year.
     * Possible values are "numeric", "2-digit".
     */
    year: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * The representation of the month.
     * Possible values are "numeric", "2-digit", "narrow", "short", "long".
     */
    month: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * The representation of the day.
     * Possible values are "numeric", "2-digit".
     */
    day: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * The representation of the hour.
     * Possible values are "numeric", "2-digit".
     */
    hour: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * The representation of the minute.
     * Possible values are "numeric", "2-digit".
     */
    minute: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * The representation of the second.
     * Possible values are "numeric", "2-digit".
     */
    second: {
      type: String,
      value: 'numeric',
      observer: '_update'
    },
    /**
     * An ISO string to attach to `<time>` element.
     */
    iso: {
      type: String,
      readOnly: true
    },
    isReady: Boolean
  },

  ready: function() {
    this.isReady = true;
    this._update();
  },

  _update: function() {
    if (!this.isReady) {
      return;
    }
    var date = Object.ensureDate({}, 'date', this.date);
    var options = {
      year: this.year ? this.year : undefined,
      month: this.month ? this.month : undefined,
      day: this.day ? this.day : undefined,
      hour: this.hour ? this.hour : undefined,
      minute: this.minute ? this.minute : undefined,
      second: this.second ? this.second : undefined
    };
    var value = new Intl.DateTimeFormat(undefined, options).format(date.date);
    this.set('display', value);
    this._setIso(date.date.toISOString());
  }
});
