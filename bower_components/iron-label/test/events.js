suite('event handling', function() {

        suite('target inside', function() {
          var inside, target;
          setup(function() {
            inside = fixture('Inside');
            target = inside.firstElementChild;
          });

          test('target has aria-labelledby', function() {
            var label = target.getAttribute('aria-labelledby');
            assert.equal(label, 'inside');
          });

          test('tap on label goes to the target', function() {
            var count = 0;
            Polymer.Gestures.add(target, 'tap', function() {
              count++;
            });
            MockInteractions.tap(inside);
            assert.equal(count, 1);
          });

          test('tap on target does not recurse', function() {
            var count = 0;
            Polymer.Gestures.add(target, 'tap', function() {
              count++;
            });
            MockInteractions.tap(target);
            assert.equal(count, 1);
          });

          test('tap on label will "activate" target', function() {
            target.checked = false;
            MockInteractions.tap(inside);
            assert.equal(target.checked, true);
          });
        });

        suite('target outside', function() {
          var outside, target;
          setup(function() {
            var temp = fixture('Outside');
            outside = temp[0];
            target = temp[1];
          });

          test('target has aria-labelledby', function() {
            var label = target.getAttribute('aria-labelledby');
            assert.equal(label, 'outside');
          });

          test('tap on label goes to the target', function() {
            var count = 0;
            Polymer.Gestures.add(target, 'tap', function() {
              count++;
            });
            MockInteractions.tap(outside);
            assert.equal(count, 1);
          });

          test('tap on label will "activate" target', function() {
            target.checked = false;
            MockInteractions.tap(outside);
            assert.equal(target.checked, true);
          });
        });

        suite('target by reordered', function() {
          var reordered, target;
          setup(function() {
            reordered = fixture('Reordered');
            target =
              Polymer.dom(reordered).querySelector('[iron-label-target]');
          });

          test('target has aria-labelledby', function() {
            var label = target.getAttribute('aria-labelledby');
            assert.equal(label, 'reordered');
          });

          test('tap on label goes to the target', function() {
            var count = 0;
            Polymer.Gestures.add(target, 'tap', function() {
              count++;
            });
            MockInteractions.tap(reordered);
            assert.equal(count, 1);
          });

          test('tap on label will "activate" target', function() {
            target.checked = false;
            MockInteractions.tap(reordered);
            assert.equal(target.checked, true);
          });
        });

      });