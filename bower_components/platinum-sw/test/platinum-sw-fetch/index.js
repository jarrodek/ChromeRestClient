suite('Service Worker Fetch Handlers', function() {
        test('the same-origin custom fetch handler is used when the path matches', function() {
          return navigator.serviceWorker.ready.then(function() {
            return window.fetch('customFetch').then(function(response) {
              assert.equal(response.status, 203, 'Custom response status doesn\'t match');
            });
          });
        });

        test('the same-origin custom fetch handler isn\'t used when the path doesn\t match', function() {
          return navigator.serviceWorker.ready.then(function() {
            return window.fetch('dummyUrlThatShould404').then(function(response) {
              assert.equal(response.status, 404, 'Expected response status doesn\'t match');
            });
          });
        });

        test('the cross-origin fetch handler is used when the path and origin matches', function() {
          return navigator.serviceWorker.ready.then(function() {
            return window.fetch('https://matching.domain/path/to/customFetch').then(function(response) {
              assert.equal(response.status, 410, 'Custom response status doesn\'t match');
            });
          });
        });
      });