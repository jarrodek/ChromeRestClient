var f1;
    var f2;
    var f3;

    setup(function() {
      var fabs = fixture('A11yFabs');

      f1 = fabs[0];
      f2 = fabs[1];
      f3 = fabs[2];
    });

    test('aria role is a button', function() {
      assert.strictEqual(f1.getAttribute('role'), 'button');
    });

    test('aria-disabled is set', function() {
      assert.ok(f2.hasAttribute('aria-disabled'));
      f2.removeAttribute('disabled');
      assert.strictEqual(f2.getAttribute('aria-disabled'), 'false');
    });

    test('aria-label is set');

    test('user-defined aria-label is preserved', function() {
      assert.strictEqual(f3.getAttribute('aria-label'), 'custom');
      f3.icon = 'arrow-forward';
      assert.strictEqual(f3.getAttribute('aria-label'), 'custom');
    });