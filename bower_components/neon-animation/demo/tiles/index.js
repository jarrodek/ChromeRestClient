var scope = document.querySelector('template[is="dom-bind"]');

      scope._onCircleClick = function(event) {
        this.$.pages.selected = 1;
      };

      scope._onSquaresClick = function(event) {
        this.$.pages.selected = 0;
      };