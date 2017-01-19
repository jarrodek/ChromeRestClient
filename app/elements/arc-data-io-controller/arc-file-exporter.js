(function() {
'use strict';

Polymer({
  is: 'arc-file-exporter',
  behaviors: [
    ArcBehaviors.ArcFileExportBehavior
  ],
  properties: {
    /** True if user started exporting data to Google Drive. */
    exporting: {
      type: Boolean,
      value: false
    },

    _writableContent: Object,
    _fileSuggestedName: String,

    // Selected form page.
    selectedPage: {
      type: Number,
      value: 0
    },
    // True if data are being prepared.
    preparing: {
      type: Boolean,
      value: false
    },
    // True when switching to the drive export and the app is checking for the authentication.
    checkingAuth: {
      type: Boolean,
      value: false
    },
    // True if the authentication check returns true.
    authenticated: {
      type: Boolean,
      value: false
    },
  },

  listeners: {
    'chrome-signin-aware-success': '_driveAuthSuccess',
    'chrome-signin-aware-canceled': '_driveAuthNot',
    'chrome-signin-aware-error': '_driveAuthNot'
  },

  reset: function() {
    this.exportContent = undefined;
    this.fileSuggestedName = undefined;
    this.selectedPage = 0;
    this.preparing = false;
    this.checkingAuth = false;
    this.authenticated = false;
    this.exporting = false;
  },
  /**
   * A handler for click on a "prepare data" button.
   */
  _prepareDataClick: function() {
    var clear = this.$$('#exportForm').serialize();
    var dbs = Object.keys(clear);
    if (dbs.length === 0) {
      StatusNotification.notify({
        message: 'Select data to be exported.'
      });
      return;
    }
    if (dbs.length === 8) {
      dbs = 'all';
    }
    // Don't put this before data serialization!
    this.preparing = true;

    this.debounce('export-click', function() {
      this._prepareData(dbs);
      this.fire('send-analytics', {
        type: 'event',
        category: 'Settings usage',
        action: 'Export data',
        label: 'Generate file'
      });
    }, 50);
  },
  /**
   * Prepare user data to download.
   * This is an async operation since data preparation may take long time
   * (depending on number of entries).
   */
  _prepareData: function(type) {
    arc.app.importer.prepareExport({
      type: type
    })
    .then((data) => {
      this.exportContent = data;
      this.selectedPage = 1;
      this.preparing = false;
    })
    .catch((cause) => {
      this.preparing = false;
      this.fire('app-log', {'message': cause, 'level': 'error'});
      StatusNotification.notify({
        message: cause.message
      });
      this.fire('send-analytics', {
        type: 'exception',
        description: cause.message,
        fatal: false
      });
    });
  },

  _suggestedFilename: function() {
    var date = new Date();
    var day = date.getDate();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    return 'arc-export-' + day + '-' + month + '-' + year + '-export.json';
  },

  _saveData: function() {
    this.fileSuggestedName = this._suggestedFilename();
    this.exportMime = 'json';
    this.exportData();
  },
  /**
   * Starts the export to drive flow.
   * It checks the authotization status. If the user didn't authorized the application then
   * it displays an authorization form. Otherwise the file name form is displayed.
   */
  _exportDriveFlow: function() {
    this.selectedPage = 2;
    this.checkingAuth = true;
    this.fileSuggestedName = this._suggestedFilename();
    window.drive.isAuth()
    .then((authenticated) => {
      this.checkingAuth = false;
      this.authenticated = authenticated;
    })
    .catch((e) => {
      if (e.message === 'OAuth2 not granted or revoked.') {
        this.checkingAuth = false;
        this.authenticated = false;
        return;
      }
      this.reset();
      StatusNotification.notify({
        message: 'Authentication error. ' + e.message
      });
    });
  },

  _exportDataDrive: function() {
    if (!this.fileSuggestedName) {
      StatusNotification.notify({
        message: 'Enter exported file name first '
      });
      return;
    }
    this.exporting = true;
    /* global drive */
    drive.file.create({
      resource: {
        name: this.fileSuggestedName,
        description: 'Advanced REST client backup file.',
        properties: {
          isExport: true,
          version: arc.app.utils.appVer
        }
      },
      media: {
        mimeType: 'application/json',
        body: JSON.stringify(this.exportContent)
      }
    })
    .then(() => {
      this.reset();
      StatusNotification.notify({
        message: 'Data export to Google Drive completed'
      });
    })
    .catch((e) => {
      this.exporting = false;
      StatusNotification.notify({
        message: 'Google Drive export error. ' + e.message
      });
    });
  },

  onFileSaved: function() {
    this.reset();
    StatusNotification.notify({
      message: 'Data export completed'
    });
  },

  onFileError: function(e) {
    this.reset();
    if (e.detail.message.indexOf('cancelled') !== -1) {
      return;
    }
    StatusNotification.notify({
      message: e.detail.message
    });
    this.fire('send-analytics', {
      type: 'exception',
      description: e.detail.message,
      fatal: false
    });
    this.fire('app-log', {'message': ['_saveFileError', e], 'level': 'error'});
  },

  _cancelExport: function() {
    this.reset();
  },

  _driveAuthSuccess: function() {
    this.authenticated = true;
  },

  _driveAuthNot: function() {
    this.authenticated = false;
  }
});
})();
