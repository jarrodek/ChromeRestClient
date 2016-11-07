(function() {
  'use strict';
  Polymer({
    is: 'headers-sets-selector',

    properties: {
      // Set to true when current request has payload
      isPayload: {
        type: Boolean,
        value: false
      },
      // Compyted deafult set of headers.
      headersDefaults: {
        type: String,
        value: '',
        computed: '_computeHeadersDefaults(isPayload)'
      },
      // User defined sets.
      customSets: Array,
      // Computed list od sets (to be displayed)
      availableSets: {
        type: Array,
        value: [],
        readOnly: true
      }
    },

    attached: function() {
      this._restoreUserData();
    },

    _getDb: function() {
      return new PouchDB('headers-sets');
    },

    observers: [
      '_computeSets(headersDefaults, customSets.*)'
    ],

    /* Compute default headers string. */
    _computeHeadersDefaults: function(isPayload) {
      var list = [{
        name: 'accept',
        value: 'application/json'
      },{
        name: 'accept-encoding',
        value: 'gzip, deflate'
      },{
        name: 'accept-language',
        value: 'en-US,en;q=0.8'
      }];
      if (isPayload) {
        list[list.length] = {
          name: 'content-type',
          value: 'application/json'
        };
      }
      list[list.length] = {
        name: 'user-agent',
        value: navigator.userAgent
      };
      return list.map((i) => i.name + ': ' + i.value).join('\n');
    },

    _restoreUserData: function() {
      var db = this._getDb();
      db.allDocs({
        // jscs:disable
        include_docs: true
        // jscs:enable
      })
      .then((result) => result.rows.map((i) => {
        let doc = i.doc;
        doc.deletable = true;
        doc.editable = true;
        return doc;
      }))
      .then((sets) => {
        this.set('customSets', sets);
      });
    },

    _sortSet: function(set) {
      set.sort((a, b) => {
        if (a.order > b.order) {
          return 1;
        }
        if (a.order < b.order) {
          return -1;
        }
        return 0;
      });
    },

    _computeSets: function(headersDefaults) {
      var list = [];
      list.push({
        name: 'Default Chrome headers',
        headers: headersDefaults,
        deletable: false,
        editable: false
      });
      let sets = this.customSets;
      this._sortSet(sets);
      list = list.concat(sets);
      this._setAvailableSets(list);
    },

    _editSet: function(e) {
      var model = this.$.repeater.modelForElement(e.target);
      model.set('item.editorEnabled', true);
    },

    addSet: function() {
      this.$.editor.opened = true;
    },

    cancelAddSet: function() {
      this.$.editor.opened = false;
    },

    _deleteSet: function(e) {
      var model = this.$.repeater.modelForElement(e.target);
      var id = model.get('item._id');
      var rev = model.get('item._rev');
      var db = this._getDb();
      db.remove(id, rev).then((resp) => {
        if (!resp.ok) {
          this.$.errorToast.text = resp.message;
          this.$.errorToast.opened = true;
          return;
        }
        var index = this.customSets.find((i) => i._id === id);
        this.splice('customSets', index, 1);
      });
    },

    _useSet: function(e) {
      var i = this.$.repeater.indexForElement(e.target);
      var headers = this.availableSets[i].headers;
      this.fire('headers-set-selected', {
        set: headers
      });
    },
    // Saved new set.
    addSetSave: function() {
      var name = this.$.editorSetName.value;
      var content = this.$.editorSetContent.value;
      if (!name || !content) {
        this.$.editorSetName.validate();
        this.$.editorSetContent.validate();
        return;
      }
      var obj = {
        name: name,
        headers: content,
        created: Date.now(),
        order: 0
      };
      var db = this._getDb();
      db.post(obj).then((insert) => {
        obj._id = insert.id;
        obj._rev = insert.rev;
        obj.deletable = true;
        obj.editable = true;
        this.$.editor.opened = false;
        this.push('customSets', obj);
      });
    },

    _isEditorEnabled: function(editorEnabled) {
      return !!editorEnabled;
    },

    _updateSet: function(e) {
      var model = this.$.repeater.modelForElement(e.target);
      var item = model.get('item');
      delete item.deletable;
      delete item.editable;
      delete item.editorEnabled;

      var db = this._getDb();
      db.put(item).then((result) => {
        model.set('item._rev', result.rev);
        model.set('item.editorEnabled', false);
      });
    }
  });
})();
