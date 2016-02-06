var scope = document.querySelector('template[is="dom-bind"]');

      scope._onPolymerClick = function(event) {
        this.$.list.sharedElements = {
          'ripple': event.target,
          'reverse-ripple': event.target
        };
        this.$.pages.selected = 1;
      };

      scope._onAngularClick = function(event) {
        this.$.list.sharedElements = {
          'ripple': event.target,
          'reverse-ripple': event.target
        };
        this.$.pages.selected = 2;
      };

      scope._onBackClick = function(event) {
        this.$.pages.selected = 0;
      };