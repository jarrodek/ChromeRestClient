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
    display: String,
    year: {
      type: Object,
      value: 'numeric',
      observer: '_update'
    },
    month: {
      type: Object,
      value: 'numeric',
      observer: '_update'
    },
    day: {
      type: Object,
      value: 'numeric',
      observer: '_update'
    },
    hour: {
      type: Object,
      value: 'numeric',
      observer: '_update'
    },
    minute: {
      type: Object,
      value: 'numeric',
      observer: '_update'
    },
    second: {
      type: Object,
      value: 'numeric',
      observer: '_update'
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
      year: this.year,
      month: this.month,
      day: this.day,
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
    var value = new Intl.DateTimeFormat(undefined, options).format(date.date);
    this.set('display', value);
  }
});
