suite('<iron-a11y-keys>', function() {
      var keys;

      setup(function() {
        keys = fixture('BasicKeys');
      });

      test('target is parentNode by default', function() {
        expect(keys.target).to.be.equal(keys.parentNode);
      });

      suite('keys attribute', function() {
        test('causes an event listener to be added', function(done) {
          keys.keys = 'space';

          keys.addEventListener('keys-pressed', function() {
            done();
          });

          Polymer.Base.async(function() {
            MockInteractions.pressSpace(keys.parentNode);
          });
        });

        test('will not trigger events for non-specified keys', function() {
          var keysPressedCount = 0;

          keys.keys = 'space';

          keys.addEventListener('keys-pressed', function() {
            keysPressedCount++;
          });

          MockInteractions.pressSpace(keys.parentNode);
          MockInteractions.pressEnter(keys.parentNode);

          expect(keysPressedCount).to.be.equal(1);
        });

        test('triggers events for space separated keys', function() {
          var keysPressed = '';

          keys.keys = 'a b c';

          keys.addEventListener('keys-pressed', function(event) {
            keysPressed += event.detail.key;
          });

          MockInteractions.pressAndReleaseKeyOn(keys.parentNode, 65);
          MockInteractions.pressAndReleaseKeyOn(keys.parentNode, 66);
          MockInteractions.pressAndReleaseKeyOn(keys.parentNode, 67);

          expect(keysPressed).to.be.equal('abc');
        });
      });

      suite('event listeners', function() {
        test('listeners are only active when element is in document', function() {
          var keysPressedCount = 0;
          var parent = keys.parentNode;

          keys.keys = 'space';

          keys.addEventListener('keys-pressed', function(event) {
            keysPressedCount++;
          });

          MockInteractions.pressSpace(parent);
          expect(keysPressedCount).to.be.equal(1);

          keys.parentNode.removeChild(keys);
          TestHelpers.flushAsynchronousOperations();

          MockInteractions.pressSpace(parent);
          expect(keysPressedCount).to.be.equal(1);

          parent.appendChild(keys);
          TestHelpers.flushAsynchronousOperations();

          MockInteractions.pressSpace(parent);
          expect(keysPressedCount).to.be.equal(2);
        });
      });
    });