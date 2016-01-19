Polymer({
  is: 'arc-data-import',
  behaviors: [
    ArcBehaviors.ArcControllerBehavior
  ],

  properties: {
    importData: {
      type: Object,
      value: {
        projects: [],
        requests: []
      }
    },
    isFileImport: {
      type: Boolean,
      computed: '_computeFileImportPreview(importData)'
    }
  },

  /**
   * Restore import view to regular state.
   */
  resetImportView: function() {

  },


  _onImportFile: function(e) {
    var file = e.detail.file;
    if (!file) {
      return;
    }
    this.$.fileReader.blob = file;
  },

  _importFileReady: function(e) {
    if (e.detail.result) {
      try {
        this.importData = JSON.parse(e.detail.result);
      } catch (e) {
        //TODO: add status message
        console.error('arc-data-import::_importFileReady::JSON.parse::error', e);
        var fileDrop = Polymer.dom(this.root).querySelector('#fileDrop');
        if (fileDrop) {
          fileDrop.reset();
        }
      }
    }
  },

  _importFileError: function(e) {
    //TODO: add status message
    console.error('arc-data-import::_importFileError', e);
    var fileDrop = Polymer.dom(this.root).querySelector('#fileDrop');
    if (fileDrop) {
      fileDrop.reset();
    }
  },

  _computeFileImportPreview: function(importData) {
    return importData.projects.length || importData.requests.length;
  },

  _canShowFileExportSection: function(importData) {
    return !(importData.projects.length || importData.requests.length);
  },

  _canShowServerSection: function(importData) {
    return !(importData.projects.length || importData.requests.length);
  }
});
