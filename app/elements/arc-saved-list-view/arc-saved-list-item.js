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
    detailsDialog: Object
  },
  listeners: {
    'dblclick': 'showDetails'
  },
  behaviors: [
    Polymer.Templatizer
  ],
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
    dialog.classList.add('nameEditDialog');
    var input = document.createElement('paper-input');
    input.value = this.request.har.pages[0].title;
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
    if (e.keyCode !== 13) {
      return;
    }
    this.set('request.har.pages.0.title', this.nameInput.value);
    this.fire('name-changed', {
      item: this.request
    });
    this.dialog.close();
  },

  _closeDialog: function() {
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
    return this.get(path, change.base[index]);
  },

  _navigateItem: function() {
    page('request/saved/' + this.request.id);
  },

  showDetails: function() {
    if (!this.detailsDialog) {
      this._createDetailsDialog();
    }
    var h2 = Polymer.dom(this.detailsDialog).querySelector('h2');
    h2.innerText = this.request.har.pages[0].title;
    /*
    var content = Polymer.dom(this.detailsDialog).querySelector('arc-request-details-dialog-view');
    content.request = this.request;
    */
    this.detailsDialog.open();
  },

  _createDetailsDialog: function() {
    this.templatize(this.$.detailsDialogTemplate);
    var instance = this.stamp({
      request: this.request
    });
    Polymer.dom(this.root).appendChild(instance.root);
    this.detailsDialog = Polymer.dom(this.root).querySelector('paper-dialog#details');
    this.detailsDialog.addEventListener('iron-overlay-opened', function(e) {
      window.setTimeout(function() {
        e = Polymer.dom(e);
        e.rootTarget.sizingTarget.classList.remove('fit');
        e.rootTarget.fit()
      }, 0);
    });

  }

});
