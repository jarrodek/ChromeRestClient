function runAfterOpen(dialog, cb) {
        dialog.addEventListener('iron-overlay-opened', function() {
          cb();
        });
        dialog.open();
      }

      suite('basic', function() {

        test('clicking dialog does not cancel the dialog', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function() {
              assert('dialog should not close');
            });
            dialog.click();
            setTimeout(function() {
              done();
            }, 100);
          });
        });

        test('clicking dialog-dismiss button closes the dialog without confirmation', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isFalse(event.detail.confirmed, 'dialog is not confirmed');
              done();
            });
            Polymer.dom(dialog).querySelector('[dialog-dismiss]').click();
          });
        });

        test('clicking dialog-confirm button closes the dialog with confirmation', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            dialog.addEventListener('iron-overlay-closed', function(event) {
              assert.isFalse(event.detail.canceled, 'dialog is not canceled');
              assert.isTrue(event.detail.confirmed, 'dialog is confirmed');
              done();
            });
            Polymer.dom(dialog).querySelector('[dialog-confirm]').click();
          });
        });

        test('with-backdrop works', function() {
          var dialog = fixture('backdrop');
          runAfterOpen(dialog, function() {
            assert.isTrue(dialog.backdropElement.opened, 'backdrop is open');
          });
        });

        test('modal dialog has backdrop', function() {
          var dialog = fixture('modal');
          assert.isTrue(dialog.withBackdrop, 'withBackdrop is true');
        });

        test('modal dialog has no-cancel-on-outside-click', function() {
          var dialog = fixture('modal');
          assert.isTrue(dialog.noCancelOnOutsideClick, 'noCancelOnOutsideClick is true');
        });

        test('clicking outside a modal dialog does not move focus from dialog', function(done) {
          var dialog = fixture('modal');
          runAfterOpen(dialog, function() {
            dialog.backdropElement.click();
            setTimeout(function() {
              assert.equal(document.activeElement, Polymer.dom(dialog).querySelector('[autofocus]'), 'document.activeElement is the autofocused button');
              done();
            }, 10);
          });
        });

        test('removing a child element on click does not cause an exception', function(done) {
          var dialog = fixture('basic');
          runAfterOpen(dialog, function() {
            var button = Polymer.dom(dialog).querySelector('[extra]');
            button.addEventListener('click', function(event) {
              Polymer.dom(event.target.parentNode).removeChild(event.target);
              // should not throw exception here
              done();
            });
            button.click();
          });
        });

      });

      suite('a11y', function() {

        test('dialog has role="dialog"', function() {
          var dialog = fixture('basic');
          assert.equal(dialog.getAttribute('role'), 'dialog', 'has role="dialog"');
        });

        test('dialog has aria-modal=false', function() {
          var dialog = fixture('basic');
          assert.equal(dialog.getAttribute('aria-modal'), 'false', 'has aria-modal="false"');
        });

        test('modal dialog has aria-modal=true', function() {
          var dialog = fixture('modal');
          assert.equal(dialog.getAttribute('aria-modal'), 'true', 'has aria-modal="true"');
        });

        test('dialog with header has aria-labelledby', function() {
          var dialog = fixture('header');
          var header = Polymer.dom(dialog).querySelector('h2');
          assert.ok(header.getAttribute('id'), 'header has auto-generated id');
          assert.equal(dialog.getAttribute('aria-labelledby'), header.getAttribute('id'), 'aria-labelledby is set to header id');
        });

        test('dialog with lazily created header has aria-labelledby', function(done) {
          var dialog = fixture('basic');
          var header = document.createElement('h2');
          Polymer.dom(dialog).appendChild(header);
          Polymer.dom.flush();
          setTimeout(function() {
            assert.ok(header.getAttribute('id'), 'header has auto-generated id');
            assert.equal(dialog.getAttribute('aria-labelledby'), header.getAttribute('id'), 'aria-labelledby is set to header id');
            done();
          }, 10);
        });

        test('dialog with header with id preserves id and has aria-labelledby', function() {
          var dialog = fixture('header-with-id');
          var header = Polymer.dom(dialog).querySelector('h2');
          assert.equal(header.getAttribute('id'), 'header', 'header has preset id');
          assert.equal(dialog.getAttribute('aria-labelledby'), 'header', 'aria-labelledby is set to header id');
        });

      });