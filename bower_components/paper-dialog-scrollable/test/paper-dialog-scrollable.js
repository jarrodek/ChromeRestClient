function runAfterScroll(node, scrollTop, callback) {
        var timeout = function() {
          node.scrollTop = scrollTop;
          if (node.scrollTop === scrollTop) {
            // there seems to be no good way to wait for pseudoelement styling to apply and
            // chrome takes a while before getComputedStyle returns the correct values
            setTimeout(function() {
              callback();
            }, 250);
          } else {
            setTimeout(timeout, 10);
          }
        };
        node.scrollTop = scrollTop;
        setTimeout(timeout);
      }

      suite('basic', function() {

        test('shows top divider if scrolled', function(done) {
          var container = fixture('basic');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, 10, function() {
              assert.ok(getComputedStyle(scrollable, '::before').content, '::before has content');
              done();
            });
          }, 10);
        });

        test('shows bottom divider if scrollable', function(done) {
          var container = fixture('basic');
          setTimeout(function() {
            var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
            requestAnimationFrame(function() {
              assert.ok(getComputedStyle(scrollable, '::after').content, '::after has content');
              done();
            });
          }, 10);
        });

        test('hides bottom divider if scrolled to bottom', function(done) {
          var container = fixture('basic');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, scrollable.scrollTarget.scrollHeight - scrollable.scrollTarget.offsetHeight, function() {
              var content = getComputedStyle(scrollable, '::after').content;
              assert.ok(!content || content === 'none', '::after does not have content');
              done();
            });
          }, 10);
        });

        test('does not show dividers if scrolled and only child', function(done) {
          var container = fixture('only-child');
          var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
          setTimeout(function() {
            runAfterScroll(scrollable.scrollTarget, 10, function() {
              var contentBefore = getComputedStyle(scrollable, '::before').content;
              assert.ok(!contentBefore || contentBefore === 'none', '::before does not have content');
              var contentAfter = getComputedStyle(scrollable, '::after').content;
              assert.ok(!contentAfter || contentAfter === 'none', '::after does not have content');
              done();
            });
          }, 10);
        });

        test('does not show bottom divider if not scrollable', function(done) {
          var container = fixture('short');
          setTimeout(function() {
            var scrollable = Polymer.dom(container).querySelector('paper-dialog-scrollable');
            var contentAfter = getComputedStyle(scrollable, '::after').content;
            assert.ok(!contentAfter || contentAfter === 'none', '::after does not have content');
            done();
          }, 10);
        });

      });