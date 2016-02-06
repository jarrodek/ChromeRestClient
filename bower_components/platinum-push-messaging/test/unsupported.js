var el = document.querySelector('platinum-push-messaging');

      suite('Element state', function() {

        test('Default properties', function() {
          assert.isUndefined(el.subscription, 'subscription');
          assert.isFalse(el.enabled, 'enabled');
          assert.isFalse(el.supported, 'supported');
        });

        test('Enable does nothing', function(done) {
          el.enable().then(function() {
            assert.isUndefined(el.subscription, 'subscription');
            assert.isFalse(el.enabled, 'enabled');
          }).then(done, done);
        });

        test('Disable does nothing', function(done) {
          el.disable().then(function() {
            assert.isUndefined(el.subscription, 'subscription');
            assert.isFalse(el.enabled, 'enabled');
          }).then(done, done);
        });

      });