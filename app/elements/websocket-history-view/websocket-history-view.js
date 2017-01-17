Polymer({
  is: 'websocket-history-view',

  properties: {
    data: Array,
    opened: Boolean,
    // Computed value, true if the element has history data.
    hasData: {
      type: Boolean,
      value: false,
      reflectToAttribute: true,
      notify: true,
      computed: '_computeHasData(data.*)',
      observer: '_hasDataChanged'
    },
    // If true then the element is loading the history data.
    loading: {
      type: Boolean,
      value: false,
      notify: true,
      readOnly: true
    }
  },

  observers: ['_openedChanged(opened)'],

  listeners: {
    'list.tap': '_listTap'
  },

  _openedChanged: function(opened) {
    if (!opened) {
      this.data = [];
      return;
    }
    this._queryHistory();
  },

  _queryHistory: function() {
    this._setLoading(true);
    var event = this.fire('websocket-url-history-object-query-history');
    if (!event.detail.result) {
      this._setLoading(false);
      return;
    }
    event.detail.result
    .then((data) => {
      this._setLoading(false);
      this.set('data', data);
    })
    .catch(() => {
      this._setLoading(false);
    });
  },

  _listTap: function(e) {
    if (e.target.nodeName !== 'PAPER-BUTTON') {
      return;
    }
    var model = this.$.list.modelForElement(e.target);
    if (!model) {
      this.fire('app-log', {
        message: 'Model not found in socket history list',
        level: 'warn'
      });
      return;
    }
    var url = model.get('item._id');
    this.fire('socket-url-change', {
      url: url
    });
  },

  _computeHasData: function(record) {
    if (!record || !record.base || !record.base.length) {
      return false;
    }
    return true;
  },

  _hasDataChanged: function() {
    this.async(() => {
      this.$.list.notifyResize();
    }, 1);
  }
});
