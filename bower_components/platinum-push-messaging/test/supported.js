// Not registered or subscribed to start
      // Register worker
      // Get a subscription
      // Trigger a push? Hard to test...
      var el = document.querySelector('platinum-push-messaging');

      suite('Element state', function() {
        setup(function(done) {
          // Beginning state should be disabled
          el.disable().then(done, done);
        });

        test('Default properties', function() {
          assert.isUndefined(el.subscription, 'subscription');
          assert.isFalse(el.enabled, 'enabled');
          assert.isTrue(el.supported, 'supported');
        });

        test('No worker registered', function(done) {
          el._getRegistration().then(function(registration) {
            assert.isUndefined(registration);
          }).then(done, done);
        });

        test('Enable', function(done) {
          el.enable().then(function() {
            assert.instanceOf(el.subscription, PushSubscription, 'subscription');
            assert.isTrue(el.enabled, 'enabled');
          }).then(done, done);
        });

        test('Disable', function(done) {
          el.disable().then(function() {
            assert.isUndefined(el.subscription, 'subscription');
            assert.isFalse(el.enabled, 'enabled');
          }).then(done, done);
        });

      });