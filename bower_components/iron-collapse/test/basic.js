suite('basic', function() {

        var collapse;
        var collapseHeight;

        setup(function() {
          collapse = fixture('test');
          collapseHeight = getComputedStyle(collapse).height;
        });

        test('opened attribute', function() {
          assert.equal(collapse.opened, true);
        });

        test('animated by default', function() {
          assert.isTrue(!collapse.noAnimation, '`noAnimation` is falsy');
        });

        test('horizontal attribute', function() {
          assert.equal(collapse.horizontal, false);
        });

        test('default opened height', function() {
          assert.equal(collapse.style.height, 'auto');
        });

        test('set opened to false triggers animation', function(done) {
          collapse.opened = false;
          // Animation got enabled.
          assert.notEqual(collapse.style.transitionDuration, '0s');
          collapse.addEventListener('transitionend', function() {
            // Animation disabled.
            assert.equal(collapse.style.transitionDuration, '0s');
            done();
          });
        });

        test('enableTransition(false) disables animations', function() {
          collapse.enableTransition(false);
          assert.isTrue(collapse.noAnimation, '`noAnimation` is true');
          // trying to animate the size update
          collapse.updateSize('0px', true);
          // Animation immediately disabled.
          assert.equal(collapse.style.height, '0px');
        });

        test('set opened to false, then to true', function(done) {
          // this listener will be triggered twice (every time `opened` changes)
          collapse.addEventListener('transitionend', function() {
            if (collapse.opened) {
              // Check finalSize after animation is done.
              assert.equal(collapse.style.height, 'auto');
              done();
            } else {
              // Check if size is still 0px.
              assert.equal(collapse.style.height, '0px');
              // Trigger 2nd toggle.
              collapse.opened = true;
              // Size should be immediately set.
              assert.equal(collapse.style.height, collapseHeight);
            }
          });
          // Trigger 1st toggle.
          collapse.opened = false;
          // Size should be immediately set.
          assert.equal(collapse.style.height, '0px');
        });

      });