/* global HeadersBehaviors */
Polymer({
  is: 'content-type-support',
  behaviors: [
    HeadersBehaviors.FillSupportBehavior
  ],
  properties: {
    /**
     * Currently selected option
     * @type {Number}
     */
    selected: {
      type: Number,
      value: -1
    },
    /**
     * Default content-type headers that have support.
     * @type {Object}
     */
    defaults: {
      type: Array,
      value: function() {
        return [
          'multipart-form-data',
          'application/x-www-form-urlencoded',
          'application/json',
          'application/xml',
          'application/base64',
          'application/octet-stream',
          'text/plain',
          'text/css',
          'text/html',
          'application/javascript'
        ];
      }
    }
  },

  hostAttributes: {
    'header-support': 'content-type'
  },

  provideSupport: function() {
    this.set('selected', this.defaults.indexOf(this.target.value));
    this.open();
    this.$.list.focus();
  },

  _selectItem: function() {
    var selected = this.defaults[this.selected];
    this.setValue(selected);
  }
});
