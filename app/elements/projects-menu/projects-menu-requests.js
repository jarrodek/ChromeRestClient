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
    querying: Boolean,
    /**
     * Current route string.
     */
    routeSavedId: {
      type: String,
      computed: '_computeRouteSavedId(routeParams.savedId)'
    },
    /**
     * Route parameters
     */
    routeParams: Object
  },

  observers: [
    '_queryRequests(opened, projectId)'
  ],

  listeners: {
    'tap': '_itemTap'
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

  _itemTap: function(e) {
    e.preventDefault();
    e.stopPropagation();
    var index;
    var path = Array.from(e.path);
    while (!index) {
      let elm = path.shift();
      if (!elm) {
        break;
      }
      if (elm.dataset && elm.dataset.index) {
        index = elm.dataset.index;
        break;
      }
    }
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
  },

  /**
   * Compytes CSS class name for the HTTP method label.
   *
   * @param {String} method an HTTP method name.
   * @return {String} CSS class name always starting with the `method` class.
   */
  _computeMethodClass: function(method) {
    if (!method) {
      return;
    }
    method = method.toLowerCase();
    var clazz = 'method ';
    switch (method) {
      case 'get':
      case 'post':
      case 'put':
      case 'delete':
      case 'patch':
        clazz += method;
        break;
    }
    return clazz;
  },

  _computeSelectedClass: function(id, routeSavedId) {
    if (!id || !routeSavedId) {
      return;
    }
    if (routeSavedId !== id) {
      return;
    }

    return 'iron-selected';
  },

  _computeRouteSavedId: function(savedId) {
    return decodeURIComponent(savedId);
  }
});
