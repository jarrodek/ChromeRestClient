suite('basic', function() {

      test('setting `invalid` sets `aria-invalid=true`', function() {
        var node = fixture('basic');
        node.invalid = true;
        assert.equal(node.getAttribute('aria-invalid'), 'true', 'aria-invalid is set');
        node.invalid = false;
        assert.isFalse(node.hasAttribute('aria-invalid'), 'aria-invalid is unset');
      });

      test('validate() is true if a validator isn\'t set', function() {
        var node = fixture('basic');
        var valid = node.validate();
        assert.isTrue(valid);
      });

    });