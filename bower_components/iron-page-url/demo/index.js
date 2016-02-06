Polymer({
        is: 'iron-page-url-demo',
        properties: {
          historyElementsAdded: {
            type: Number
          }
        },
        observers: [
          'checkHistorySize(path, hash, query, startingHistoryLength)'
        ],
        ready: function() {
          this.startingHistoryLength = window.history.length;
        },
        checkHistorySize: function() {
          this.historyElementsAdded =
              window.history.length - this.startingHistoryLength;
        },
        inSeconds: function(dwellTime) {
          if (dwellTime === -1) {
            return -1;
          }
          return (Math.round(dwellTime / 100) / 10)
        }
      });