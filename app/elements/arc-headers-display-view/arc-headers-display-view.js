'use strict';
/* global arc */
Polymer({
  is: 'arc-headers-display-view',
  properties: {
    /**
     * An array of headers to display.
     *
     * @type {Array}
     */
    headers: Array,
    /**
     * Type of the header.
     * Can be either `request` or `response`.
     * Frm this value depends which value from the model will be get to display details.
     *
     * @type {String}
     */
    type: {
      type: String,
      value: 'response'
    },
    /**
     * Header title in the details dialog.
     *
     * @type {String}
     */
    _hdTitle: String,
    /**
     * Header description in the details dialog.
     *
     * @type {String}
     */
    _hdBody: String,
    /**
     * Header example in the details dialog.
     *
     * @type {String}
     */
    _hdExample: String,
  },
  /**
   * Double click on header line handler.
   * Will call model for data to display.
   */
  _displayHeaderInfo: function(e) {
    var item = e.model.get('item');
    this.$.model.objectId = [item.name.toLowerCase(), this.type];
    this.$.model.getObject();
  },
  /** Called when model returned data */
  _onHeaderData: function(e) {
    var result = e.detail.data;
    if (!result) {
      return;
    }
    this._hdTitle = result.name;
    this._hdBody = result.desc;
    this._hdExample = result.example;
    this.$.headerInfo.open();
  }
});
