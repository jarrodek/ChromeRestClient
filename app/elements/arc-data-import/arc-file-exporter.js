Polymer({
  is: 'arc-file-exporter',

  properties: {
    /** True if user started exporting data to a file. */
    exporting: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    },
    /** True if data are preparing to export */
    loading: {
      notify: false,
      readOnly: true,
      type: Boolean,
      value: false
    },

    dataReady: {
      notify: true,
      readOnly: true,
      type: Boolean,
      value: false
    }
  },

  _prepareDataClick: function() {
    this.debounce('export-click', function() {
      this._setExporting(true);
      this._setLoading(true);
      this._prepareData();
    }, 50);
  },

  _prepareData: function() {
    arc.app.importer.prepareExport()
      .then(function(data) {
        let toExport;
        try {
          toExport = JSON.stringify(data);
        } catch (e) {
          console.error('Unable to prepare data to export.', e.message);
          throw e;
        }
        this._setLoading(false);
        this._setDataReady(true);
        console.log(data, toExport);
      }.bind(this))
      .catch((cause) => {
        console.error(cause);
        arc.app.analytics.sendException(cause.message, true);
      });
  }
});
