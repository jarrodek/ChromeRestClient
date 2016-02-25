Polymer({
  is: 'payload-editor',
  properties: {
    /**
     * A HTTP body message part.
     *
     * @type {String}
     */
    value: {
      type: String,
      value: '',
      notify: true
    },
    /**
     * A value of a Content-Type header.
     *
     * @type {Stirng}
     */
    contentType: {
      type: String,
      observer: '_onContentTypeChanged'
    },
    tabSelected: {
      type: Number,
      value: 0,
      observer: '_selectedTabChanged'
    },
    valuesList: {
      type: Array,
      value: []
    },
    withForm: {
      type: Boolean,
      value: false,
      computed: '_computeWithForm(contentType)'
    }
  },
  observers: ['_updateTabsState(withForm)'],
  /**
   * Change CodeMirror mode on change.
   * Also, if the Content-Type is not x-www-form-urlencoded and form editor is shown hide it.
   */
  _onContentTypeChanged: function() {
    this.$.cm.mode = this.contentType;
    if (!this.withForm && this.tabSelected === 1) {
      this.set('tabSelected', 0);
    }
  },
  /** Set value if has form */
  _selectedTabChanged: function() {

  },
  /** Compute if form tab should be shown. */
  _computeWithForm: function(contentType) {
    return contentType && contentType.indexOf('x-www-form-urlencoded') !== -1;
  },

  valueChanged: function() {
    console.log('payload editor:: value changed', this.value);
  },

  _updateTabsState: function(withForm) {
    this.$.tabs.notifyResize();
  }
});
