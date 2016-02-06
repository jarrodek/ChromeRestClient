var scope = document.querySelector('template[is=dom-bind]');

    scope.setValue = function(event) {
      if (!(event.target instanceof HTMLButtonElement)) {
        return;
      }
      document.querySelector('input[is=iron-input]')[event.target.value] = event.target.previousElementSibling.value;
    };