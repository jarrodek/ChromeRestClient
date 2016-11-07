Polymer({
  is: 'variables-editor',

  properties: {
    currentEnvironment: {
      type: String,
      value: 'default',
    },

    variables: {
      type: Array,
      value: function() {
        return [];
      }
    },

    environments: {
      type: Array,
      value: function() {
        return [];
      }
    },

    indexFields: {
      type: Array,
      value: function() {
        return ['environment'];
      }
    },

    querySelector: {
      type: String,
      computed: '_computeQuerySelector(currentEnvironment)'
    },

    queryFields: {
      type: Array,
      value: function() {
        return ['_id', 'environment'];
      }
    },

    querySort: {
      type: Array,
      value: function() {
        return [{'_id': 'desc'}];
      }
    },

    noVariables: {
      type: Boolean,
      value: true,
      computed: '_computeNoVariables(variables.*)'
    },

    hideRemoved: {
      type: Boolean,
      value: true,
      computed: '_computeHideRemoved(currentEnvironment)'
    }
  },

  listeners: {
    'variable-deleted': '_onVariableDeleted'
  },

  observers: [
    '_queryChanged(querySelector)',
    '_envChanged(currentEnvironment)'
  ],

  attached: function() {
    this._refreshEnvironments();
  },

  _computeQuerySelector: function(currentEnvironment) {
    if (!currentEnvironment) {
      return '';
    }
    currentEnvironment = currentEnvironment.replace(/'/gim, '\\\'');
    return 'environment $eq \'' + currentEnvironment + '\'';
  },

  _computeNoVariables: function() {
    if (!this.variables || !this.variables.length) {
      return true;
    }
    return false;
  },

  _computeHideRemoved: function(currentEnvironment) {
    if (!currentEnvironment || currentEnvironment === 'default') {
      return true;
    }
    return false;
  },

  _addVariable: function() {
    this.push('variables', {
      environment: this.currentEnvironment,
      enabled: false
    });
    this.fire('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Add variable'
    });
  },

  _onVariableDeleted: function(e) {
    var id = e.detail.id;
    var index = this.variables.findIndex((i) => i._id === id);
    if (index !== -1) {
      this.splice('variables', index, 1);
    }
    this.fire('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Delete variable'
    });
  },

  addEnvironment: function() {
    this.$.editor.opened = true;
  },

  cancelAddEnvironment: function() {
    this.$.editor.opened = false;
  },

  addEnvSave: function() {
    var name = this.$.editorEnvName.value;
    if (!name) {
      this.$.editorEnvName.validate();
      return;
    }
    var lowerName = name.toLowerCase();

    if (lowerName === 'default') {
      this.$.infoToast.text = 'This name is reserved';
      this.$.infoToast.opened = true;
      return;
    }

    var index = this.environments.findIndex((i) => i.name.toLowerCase() === lowerName);
    if (index !== -1) {
      this.$.infoToast.text = 'Environment already exists';
      this.$.infoToast.opened = true;
      return;
    }

    var obj = {
      name: name,
      created: Date.now()
    };
    var db = new PouchDB('variables-environments');
    db.post(obj)
    .then((insert) => {
      obj._id = insert.id;
      obj._rev = insert.rev;
      this.$.editor.opened = false;
      this.push('environments', obj);
      this.set('currentEnvironment', name);
      this.set('variables', []);
      this._addVariable();
    });
    this.fire('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Add environment'
    });
  },

  _refreshEnvironments: function() {
    var db = new PouchDB('variables-environments');
    db.allDocs({
      // jscs:disable
      include_docs: true
      // jscs:enable
    })
    .then((r) => r.rows.map((i) => i.doc))
    .then((r) => this.set('environments', r));
  },

  _queryChanged: function() {
    this.set('variables', []);
  },

  _envChanged: function(currentEnvironment) {
    this.fire('variables-environment-changed', {
      env: currentEnvironment
    });
    this.fire('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Select environment'
    });
  },

  removeEnvironment: function() {
    if (this.currentEnvironment === 'default') {
      return;
    }
    var old = this.currentEnvironment;
    this.set('currentEnvironment', 'default');
    var db = new PouchDB('variables-environments');
    var index = this.environments.findIndex((i) => i.name === old);
    if (index === -1) {
      return;
    }
    var item = this.environments[index];
    item._deleted = true;
    db.put(item).then(() => {
      this.splice('environments', index, 1);
    });
    this.fire('send-analytics', {
      type: 'event',
      category: 'Variables editor',
      action: 'Delete environment'
    });
  }
});
