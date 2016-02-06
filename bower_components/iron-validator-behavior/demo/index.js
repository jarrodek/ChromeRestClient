document.addEventListener('WebComponentsReady', function() {

      var validator = new Polymer.IronMeta({type: 'validator'}).byKey('cats-only');

      var scope = document.querySelector('template[is=dom-bind]');
      scope.valid = scope.validMulti = scope.validForm = true;

      scope._onInput = function(event) {
        this.valid = validator.validate(event.target.value);
      };

      scope._onInputMulti = function(event) {
        var values = [];
        var nodes = Polymer.dom(event.currentTarget).querySelectorAll('input');
        for (var node, i = 0; node = nodes[i]; i++) {
          values.push(node.value);
        }
        this.validMulti = validator.validate(values);
      };

      scope._onSubmit = function(event) {
        event.preventDefault();

        var data = {};
        for (var el, i = 0; el = event.target.elements[i]; i++) {
          if (el.name) {
            data[el.name] = el.value;
          }
        }
        this.validForm = validator.validate(data);
      };

    });