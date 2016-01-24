Polymer({
  is: 'arc-saved-list-item',
  properties: {
    /**
     * A single request object to display in table row.
     */
    request: {
      type: Object,
      notify: true
    },
    /**
     * True if this row element is checked.
     */
    checked: {
      type: Boolean,
      notify: true,
      reflectToAttribute: true,
      value: false
    },

    requestNewName: String,
  },
  detached: function() {
    if (this.dialog) {
      this.dialog.close();
    }
  },
  _editName: function() {
    if (this.dialog) {
      return;
    }
    var dialog = document.createElement('paper-dialog');
    dialog.classList = 'nameEditDialog';
    var input = document.createElement('paper-input');
    input.label = 'Request name';
    input.value = this.request.har.pages[0].title;
    input.errorMessage = 'Add name for this request';
    input.autoValidate = true;
    input.charCounter = true;
    input.required = true;
    input.autofocus = true;
    input.maxlength = 60;
    this._keyDownBindFunction = this._acceptName.bind(this);
    this._closeDialogBindFuntion = this._closeDialog.bind(this);
    input.addEventListener('keydown', this._keyDownBindFunction);
    dialog.addEventListener('iron-overlay-closed', this._closeDialogBindFuntion)
    dialog.appendChild(input);
    this.root.appendChild(dialog);
    dialog.open();
    this.dialog = dialog;
    this.nameInput = input;
  },

  _acceptName: function(e) {
    if(e.keyCode !== 13) {
      return;
    }
    this.set('request.har.pages.0.title', this.nameInput.value);
    //this.request.har.pages[0].title = this.nameInput.value;
    this.fire('name-changed', {
      item: this.request
    });
    this.dialog.close();
  },

  _closeDialog: function(e) {
    this.nameInput.removeEventListener('keydown', this._keyDownBindFunction);
    this.dialog.removeEventListener('iron-overlay-closed', this._closeDialogBindFuntion);
    this._keyDownBindFunction = null;
    this.nameInput = null;
    this.dialog = null;
    var elm = Polymer.dom(this.root);
    var dialog = elm.querySelector('paper-dialog');
    if (dialog) {
      elm.removeChild(dialog);
    }
  },

  arrayItem: function(change, index, path) {
    return this.get(path, change.base[index]);
  }

});
