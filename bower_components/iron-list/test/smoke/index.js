HTMLImports.whenReady(function() {

      Polymer({

        is: 'x-app',

        properties: {
          data: {
            value: window.dummyData
          },
          separator: {
            value: '|'
          },
          showing: {
            value: false
          }
        },
        pictureForItem: function(item) {
          return item.picture + '/' + item.guid.slice(0,6);
        },
        iconForItem: function(item) {
          return item.gender == 'female' ? 'star' : 'star-outline';
        }
      });

    });