var scope = document.querySelector('template[is="dom-bind"]');

      scope._onTileClick = function(event) {
        this.$['fullsize-card'].color = event.detail.data.color;
        this.$.pages.selected = 1;
      };

      scope._onFullsizeClick = function(event) {
        this.$.pages.selected = 0;
      };