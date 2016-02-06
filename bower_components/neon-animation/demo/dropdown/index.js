var scope = document.querySelector('template[is="dom-bind"]');

      scope._onButtonClick = function(event) {
        var dropdown = document.querySelector('#' + event.target.getAttribute('dropdown-id'));
        if (dropdown) {
          dropdown.show();
        }
      };

      scope._onDropdownClick = function(event) {
        event.target.hide();
      };