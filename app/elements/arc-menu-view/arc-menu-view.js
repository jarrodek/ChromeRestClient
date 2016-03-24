(function() {
  Polymer({
    is: 'arc-menu-view',

    properties: {
      /**
       * Current route object.
       */
      route: String,
      /**
       * Apps base URL.
       */
      baseUrl: String,
      /**
       * A list of projects
       */
      projects: Array,
      /**
       * Remove history from view if set to true.
       */
      noHistory: {
        type: Boolean,
        value: false
      },
      /** Is the app has been authorized by the user. */
      appAuthorized: {
        type: Boolean,
        value: false
      }
    },

    _itemTap: function(e) {
      e = Polymer.dom(e);
      var place = e.localTarget.dataset.place;
      if (place) {
        this.fire('navigate', {
          url: place
        });
      }
    },

    /**
     * Sort projects by name.
     */
    computeSort: function() {
      return function(a, b) {
        if (a.name > b.name) {
          return 1;
        }
        if (a.name < b.name) {
          return -1;
        }
        if (a.name === b.name) {
          return 0;
        }
      };
    },
    /**
     * Request app authorization.
     * Can be calle only if the user hasn't authorized the app.
     */
    _onAuth: function() {
      this.fire('authorize-requested');
    },
    /**
     * Request to sign out from the app.
     */
    _onSignOut: function() {
      this.fire('signout-requested');
    },
    /**
     * Opens an issue tracker - new issue report.
     *
     */
    newIssueReport: function() {
      var os = this._getOsInfo();
      var message = 'Your description here\n\n';
      message += '## Expected outcome\nWhat should happen?\n\n';
      message += '## Actual outcome\nWhat happened?\n\n';
      message += `## Versions\nApp: ${chrome.runtime.getManifest().version_name}\n`;
      message += `Chrome: ${navigator.appVersion.match(/Chrome\/((\d+\.?)+)/)[1]}\n`;
      message += `Platform: ${os.os} (${os.osVersion})\n\n`;
      message += '## Steps to reproduce\n1. \n2. \n3. ';
      message = encodeURIComponent(message);
      window.open('https://github.com/jarrodek/ChromeRestClient/issues/new?body=' + message);
    },

    _getOsInfo: function() {
      var os = 'unknown';
      var nAgt = navigator.userAgent;
      var clientStrings = [{
        s: 'Windows 10',
        r: /(Windows 10.0|Windows NT 10.0)/
      }, {
        s: 'Windows 8.1',
        r: /(Windows 8.1|Windows NT 6.3)/
      }, {
        s: 'Windows 8',
        r: /(Windows 8|Windows NT 6.2)/
      }, {
        s: 'Windows 7',
        r: /(Windows 7|Windows NT 6.1)/
      }, {
        s: 'Windows Vista',
        r: /Windows NT 6.0/
      }, {
        s: 'Windows Server 2003',
        r: /Windows NT 5.2/
      }, {
        s: 'Windows XP',
        r: /(Windows NT 5.1|Windows XP)/
      }, {
        s: 'Windows 2000',
        r: /(Windows NT 5.0|Windows 2000)/
      }, {
        s: 'Windows ME',
        r: /(Win 9x 4.90|Windows ME)/
      }, {
        s: 'Windows 98',
        r: /(Windows 98|Win98)/
      }, {
        s: 'Windows 95',
        r: /(Windows 95|Win95|Windows_95)/
      }, {
        s: 'Windows NT 4.0',
        r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/
      }, {
        s: 'Windows CE',
        r: /Windows CE/
      }, {
        s: 'Windows 3.11',
        r: /Win16/
      }, {
        s: 'Android',
        r: /Android/
      }, {
        s: 'Open BSD',
        r: /OpenBSD/
      }, {
        s: 'Sun OS',
        r: /SunOS/
      }, {
        s: 'Linux',
        r: /(Linux|X11)/
      }, {
        s: 'iOS',
        r: /(iPhone|iPad|iPod)/
      }, {
        s: 'Mac OS X',
        r: /Mac OS X/
      }, {
        s: 'Mac OS',
        r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/
      }, {
        s: 'QNX',
        r: /QNX/
      }, {
        s: 'UNIX',
        r: /UNIX/
      }, {
        s: 'BeOS',
        r: /BeOS/
      }, {
        s: 'OS/2',
        r: /OS\/2/
      }, {
        s: 'Search Bot',
        r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/
      }];
      for (var id in clientStrings) {
        var cs = clientStrings[id];
        if (cs.r.test(nAgt)) {
          os = cs.s;
          break;
        }
      }

      var osVersion = '-';

      if (/Windows/.test(os)) {
        osVersion = /Windows (.*)/.exec(os)[1];
        os = 'Windows';
      }

      switch (os) {
        case 'Mac OS X':
          osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
          break;

        case 'Android':
          osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
          break;

        case 'iOS':
          osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
          osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
          break;
      }

      return {
        os: os,
        osVersion: osVersion
      };
    }
  });
})();
