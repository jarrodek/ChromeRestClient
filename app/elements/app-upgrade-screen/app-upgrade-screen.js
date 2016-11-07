(function() {
'use strict';
Polymer({
  is: 'app-upgrade-screen',
  behaviors: [Polymer.IronOverlayBehavior],

  properties: {
    alwaysOnTop: {
      type: Boolean,
      value: true
    },
    noCancelOnEscKey: {
      type: Boolean,
      value: true
    },
    noCancelOnOutsideClick: {
      type: Boolean,
      value: true
    },
    state: {
      type: Number,
      value: 0
    },
    upgrading: {
      type: Boolean,
      reflectToAttribute: true
    },
    logs: {
      type: Array,
      value: function() {
        return [{
          message: 'Initializing upgrade'
        }];
      }
    },
    currentLog: {
      type: String,
      value: function() {
        return {
          message: 'Initializing upgrade'
        };
      }
    },
    allLogs: {
      type: Boolean,
      value: false
    },
    errored: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    },
    finished: {
      type: Boolean,
      value: false,
      reflectToAttribute: true
    }
  },

  observers: [
    '_stateChanged(state)',
    '_onFinished(finished)'
  ],

  ready: function() {
    // begin the show
    this.async(() => {
      this.state = 1;
    }, 2500);
  },

  attached: function() {
    this.listen(window, 'app-upgrade-screen-log', '_onLog');
  },

  detached: function() {
    this.unlisten(window, 'app-upgrade-screen-log', '_onLog');
  },

  _stateChanged: function(state) {
    switch (state) {
      case 1:
        this.upgrading = true;
        this.fire('app-initialize-upgrade');
      break;
    }
  },

  _onLog: function(e) {
    var detail = e.detail;
    var msg;
    if (detail.error) {
      msg = detail.error.message + '\n';
      msg += detail.error.stack;
      this.push('logs', {
        error: true,
        message: msg,
        id: detail.value
      });
      this.set('currentLog', {
        error: true,
        message: detail.error.message
      });
      this.showDetails();
      this.set('errored', true);
    } else {
      msg = `[${detail.value}] ${detail.message}`;
      this.push('logs', {
        error: false,
        message: msg,
        id: detail.value
      });
      this.set('currentLog', {
        error: false,
        message: msg
      });
    }
  },

  showDetails: function() {
    this.set('allLogs', true);
  },

  hideDetails: function() {
    this.set('allLogs', false);
  },

  _errorClass: function(error) {
    return error ? 'error' : '';
  },

  issueReport: function() {
    var os = arc.app.utils.osInfo;
    var message = 'The app errored during latest upgrade.\n\n';
    message += '## Logs\n\n';
    message += '```\n';
    var ids = [];
    this.logs.forEach(function(item) {
      message += item.message + '\n';
      if (!item.id) {
        return;
      }
      if (ids.indexOf(item.id) === -1) {
        ids[ids.length] = item.id;
      }
    });
    message += '```\n';
    /*jshint camelcase: false */
    // jscs:disable requireCamelCaseOrUpperCaseIdentifiers
    message += `## Versions\nApp: ${chrome.runtime.getManifest().version_name}\n`;
    //jscs:enable requireCamelCaseOrUpperCaseIdentifiers
    /*jshint camelcase: true */
    message += `Chrome: ${navigator.appVersion.match(/Chrome\/((\d+\.?)+)/)[1]}\n`;
    message += `Platform: ${os.osName} (${os.osVersion})\n\n`;
    message = encodeURIComponent(message);
    var title = encodeURIComponent('ARC upgrade error');
    var labels = 'labels[]=bug&labels[]=upgrade-errors';
    ids.forEach((item) => {
      labels += '&labels[]=upgrade-' + encodeURIComponent(item);
    });
    var url = 'https://github.com/jarrodek/ChromeRestClient/issues/new?';
    url += 'title=' + title;
    url += '&body=' + message;
    url += '&assignee=jarrodek';
    url += '&' + labels;
    window.open(url);
  },

  continueErrord: function() {
    if (this.finished) {
      this.finish();
      return;
    }
    this.fire('app-upgrade-screen-coninue-errored');
  },

  _onFinished: function(finished) {
    if (!finished) {
      return;
    }
    this.hideDetails();
  },

  _hideClose: function(errored, finished) {
    if (finished && !errored) {
      return false;
    }
    return true;
  },

  finish: function() {
    this.opened = false;
    this.fire('app-upgrade-screen-closed');
  }
});
})();
