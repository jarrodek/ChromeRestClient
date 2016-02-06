document.addEventListener('WebComponentsReady', function() {
        var sw = document.querySelector('platinum-sw-register');
        suite('Unsupported', function() {
          test('state is properly set', function() {
            assert.equal(sw.state, 'unsupported');
          });
        });
      });