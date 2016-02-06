suite('a11y', function() {

        test('dialog has role="dialog"', function() {
          var dialog = fixture('basic');
          assert.equal(dialog.getAttribute('role'), 'dialog', 'has role="dialog"');
        });

      });