var sw = document.querySelector('platinum-sw-register');

      suite('Registration & Installation', function() {
        test('creates an active service worker', function() {
          return navigator.serviceWorker.ready.then(function(registration) {
            assert.ok(registration.active);
          });
        });

        test('state is set to "installed"', function() {
          assert.equal(sw.state, 'installed');
        });
      });