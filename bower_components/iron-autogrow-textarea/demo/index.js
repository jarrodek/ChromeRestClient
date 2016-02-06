var scope = document.querySelector('template[is=dom-bind]');

      scope.setValue = function(event) {
        if (!(event.target instanceof HTMLButtonElement)) {
          return;
        }
        var inputValue = event.target.previousElementSibling.value;
        if (event.target.value == "bindValue") {
          document.querySelector('iron-autogrow-textarea').bindValue = inputValue;
        } else {
          document.querySelector('iron-autogrow-textarea').textarea.value = inputValue;
        }

      };