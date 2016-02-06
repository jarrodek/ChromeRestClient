HTMLImports.whenReady(function() {
        Polymer({
          is: 'x-progressbar',

          behaviors: [Polymer.IronRangeBehavior],

          _computeStyle: function(ratio) {
            return 'width: ' + ratio + '%;';
          }
        });
      });