(function() {
'use strict';
Polymer({
  is: 'app-db-upgrade-1016',

  ready: function() {
    this.initUpgrade();
  },

  initUpgrade: function() {
    arc.app.importer.prepareExport().then((data) => {
      console.log(data);
    }).catch((e) => {
      console.error(e);
    });
  }
});
})();
