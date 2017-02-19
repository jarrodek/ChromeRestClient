Polymer({
  is: 'projects-menu-requests',

  properties: {
    projectId: String,
    opened: {
      type: Boolean,
      value: false,
      observer: '_openedChanged'
    },
    requests: Array,
    querying: Boolean
  },

  observers: [
    '_queryRequests(opened, projectId)'
  ],

  listeners: {
    'tap': '_itepTap'
  },

  _queryRequests: function(opened, projectId) {
    if (!opened || !projectId) {
      this.set('requests', []);
    }
  },

  _openedChanged: function(value) {
    if (value) {
      this.removeAttribute('hidden');
    } else {
      this.setAttribute('hidden', 'true');
    }
  },

  _itepTap: function(e) {
    e.preventDefault();
    e.stopPropagation();

    var index = e.path[0].dataset.index;
    if (!index) {
      return;
    }
    index = Number(index);
    if (index !== index) {
      return;
    }
    var value = this.requests[index];
    if (!value) {
      return;
    }

    var url = 'request/saved/' + encodeURIComponent(value._id);
    page(url);
  }
});
