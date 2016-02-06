suite('Importing Service Worker Scripts', function() {
        // TODO: postMessage/message events are in flux in the Service Worker spec, so this may
        // need to change in the future.
        test('message handler is registered via imported script', function(done) {
          return navigator.serviceWorker.ready.then(function(registration) {
            var message = 'hello';
            var messageChannel = new MessageChannel();
            messageChannel.port1.onmessage = function(event) {
              assert.equal(event.data, message);
              done();
            };
            registration.active.postMessage(message, [messageChannel.port2]);
          });
        });
      });