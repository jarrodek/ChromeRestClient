Polymer({
  is: 'arc-saved-list-item',
  properties: {
    /**
     * A single request object to display in table row.
     */
    request: {
      type: Object,
      notify: true,
      observer: '_requestChanged'
    },
    /**
     * True if this row element is selected.
     */
    selected: {
      type: Boolean,
      notify: true,
      reflectToAttribute: true,
      value: false
    },
    /**
     * Handler to the request details dialog
     */
    detailsDialog: Object,
    /**
     * True if this view represents history item.
     */
    isHistory: {
      type: Boolean,
      value: false
    },
    savedIcon: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    driveIcon: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // True to not show the checkbox
    noCheck: {
      type: Boolean,
      value: false
    },
    // If true "delete" button will be displayed. `delete` event will be fired.
    canDelete: {
      type: Boolean,
      value: false
    }
  },

  behaviors: [
    Polymer.Templatizer
  ],

  _requestChanged: function() {
    var type = this.request.type;
    if (type === 'saved') {
      if (this.isHistory) {
        this._setSavedIcon(true);
      } else {
        this._setSavedIcon(false);
      }
    } else if (type === 'drive') {
      if (this.isHistory) {
        this._setSavedIcon(true);
      } else {
        this._setSavedIcon(false);
      }
      this._setDriveIcon(true);
    } else {
      this._setSavedIcon(false);
      this._setDriveIcon(false);
    }
  },

  detached: function() {
    if (this.dialog) {
      this.dialog.close();
    }
  },
  _editName: function() {
    if (this.dialog || this.isHistory) {
      return;
    }
    var dialog = document.createElement('paper-dialog');
    dialog.classList.add('nameEditDialog');
    var input = document.createElement('paper-input');
    input.value = this.request.name;
    input.setAttribute('class', 'name-input');
    input.errorMessage = 'Add name for this request';
    input.autoValidate = true;
    input.charCounter = true;
    input.required = true;
    input.autofocus = true;
    input.noLabelFloat = true;
    input.maxlength = 60;
    this._keyDownBindFunction = this._acceptName.bind(this);
    this._closeDialogBindFuntion = this._closeDialog.bind(this);
    input.addEventListener('keydown', this._keyDownBindFunction);
    dialog.addEventListener('iron-overlay-closed', this._closeDialogBindFuntion);
    dialog.appendChild(input);
    Polymer.dom(this.root).appendChild(dialog);
    dialog.open();
    this.dialog = dialog;
    this.nameInput = input;
  },

  _acceptName: function(e) {
    if (e.keyCode !== 13 || this.isHistory) {
      return;
    }
    this.set('request.har.pages.0.title', this.nameInput.value);
    this.set('request.name', this.nameInput.value);
    this.fire('name-changed', {
      item: this.request
    });
    this.dialog.close();
  },

  _closeDialog: function() {
    if (this.isHistory) {
      return;
    }
    this.nameInput.removeEventListener('keydown', this._keyDownBindFunction);
    this.dialog.removeEventListener('iron-overlay-closed', this._closeDialogBindFuntion);
    this._keyDownBindFunction = null;
    this.nameInput = null;
    this.dialog = null;
    var elm = Polymer.dom(this.root);
    var dialog = elm.querySelector('paper-dialog.nameEditDialog');
    if (dialog) {
      elm.removeChild(dialog);
    }
  },

  arrayItem: function(change, index, path) {
    var date = Object.ensureDate({}, 'date', this.get(path, change.base[index]));
    var options = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric'
    };
    return new Intl.DateTimeFormat(undefined, options).format(date.date);
  },

  _navigateItem: function() {
    var url;
    if (this.isHistory) {
      url = 'request/history/' + this.request.id;
    } else {
      url = 'request/saved/' + this.request.id;
    }
    page(url);
  },
  
  _deleteItem: function() {
    this.fire('delete', {
      request: this.request
    });
  }

});
