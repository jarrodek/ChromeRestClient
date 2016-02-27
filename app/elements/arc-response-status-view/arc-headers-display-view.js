'use strict';
/* global arc */
Polymer({
  is: 'arc-headers-display-view',
  properties: {
    headers: Array,
    _hdTitle: String,
    _hdBody: String,
    _hdExample: String,
  },
  _displayHeaderInfo: function(e) {
    var item = e.model.get('item');
    debugger;
    arc.app.db.websql.getHeaderByName(item.name, item.type)
      .then(function(result) {
        if (result === null) {
          return;
        }
        result = result[0];
        this._hdTitle = result.name;
        this._hdBody = result.desc;
        this._hdExample = result.example;
        this.$.headerInfo.open();
      }.bind(this));
  }
});
