var scope = document.querySelector('template[is="dom-bind"]');

      scope._onCircleButtonClick = function(event) {
        var node = document.querySelector('my-animatable');
        if (node) {
          node.animate();
        }
      };

      scope._onDialogButtonClick = function(event) {
        var node = document.querySelector('my-dialog');
        if (node) {
          if (node.opened) {
            node.hide();
          } else {
            node.show();
          }
        }
      };