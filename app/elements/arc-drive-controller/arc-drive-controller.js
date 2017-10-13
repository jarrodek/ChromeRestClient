(function() {
'use strict';
/* global drive */
/**
 * TODO:0 Error message handling
 */
Polymer({
  is: 'arc-drive-controller',
  behaviors: [
    Polymer.IronOverlayBehavior,
    Polymer.IronResizableBehavior,
    ArcBehaviors.ListControllerBehavior
  ],
  hostAttributes: {
    'role': 'dialog',
    'tabindex': '-1'
  },
  properties: {
    // Drive query oprions
    _driveQueryProperties: {
      type: Object,
      value: function() {
        return {
          isExport: true
        };
      }
    },
    // If set it will restore request file when the file content has been read.
    restoreOnFile: Boolean
  },

  listeners: {
    'import-action': '_importAction',
    'drive-file-picker-data': '_onGoogleDriveDownload',
    'cancel': '_cancel'
  },

  /**
   * Cancel current view and close the dialog.
   */
  _cancel: function() {
    this.opened = false;
  },
  /**
   * Ajax call success handler for file download.
   */
  _onGoogleDriveDownload: function(response) {
    try {
      response = JSON.parse(response.detail.content);
    } catch (e) {
      StatusNotification.notify({
        message: 'This is not a JSON file. ' + e.message
      });
      return;
    }
    if (response.kind && response.requests) {
      response = response.requests[0];
    }
    // TODO: Check if this is an export file and if it is, import it.

    let obj = arc.app.importer.normalizeRequest(response);
    obj.type = 'google-drive';
    obj.driveId = this.fileId;
    this.opened = false;
    delete obj.id;
    if (this.restoreOnFile) {
      this.fire('restore-request', {
        request: obj
      });
    } else {
      this.fire('file-ready', {
        file: obj
      });
    }
  },

  exportDrive: function(requestObject, fileName) {
    var driveId = null;
    if (requestObject.driveId) {
      driveId = requestObject.driveId;
      delete requestObject.driveId;
    }
    this.viewSelected = 0;
    var exportObj = arc.app.importer.createExportObject({
      requests: [requestObject],
      projects: [],
      type: 'saved'
    });
    if (driveId) {
      return drive.file.update(driveId, {
        resource: {
          name: fileName + '.arc',
        },
        media: {
          mimeType: 'application/json',
          body: exportObj
        }
      })
      .catch((e) => {
        this.fire('app-log', {'message': ['PATCH error', e], 'level': 'error'});
      });
    }
    return drive.file.create({
      resource: {
        name: fileName + '.arc',
        description: 'Advanced REST client exported file.'
      },
      media: {
        mimeType: 'application/json',
        body: exportObj
      }
    });
  },
  /**
   * Click handler for "Back" action in error message view.
   */
  _restoreDefaulView: function() {
    this.viewSelected = 0;
  },
  /**
   * This function is called by the request panel.
   * Opend the Google Drive item by its ID.
   */
  openItemAsRequest: function(id) {
    this.opened = true;
    var picker = this.$$('drive-file-picker');
    picker._downloadFile(id);
  }
});
})();
