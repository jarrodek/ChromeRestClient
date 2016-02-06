suite('scroll', function() {
      var scrollHeaderPanel;

      setup(function() {
        scrollHeaderPanel = fixture('trivialProgress');
        scrollHeaderPanel.measureHeaderHeight();
      });

      teardown(function() {
        scrollHeaderPanel.scroll(0);
      });

      test('scroll smoothly', function(done) {
        var destination = 100;
        var adjustments = 0;
        
        function check() {
          if (scrollHeaderPanel.scroller.scrollTop === destination) {
            assert.notEqual(adjustments, 0);
            done();
            return;
          }
          adjustments++;
          setTimeout(check, 0);
        }
        scrollHeaderPanel.scroll(destination, true);
        check();
      });

      test('condense smoothly', function(done) {
        flush(function() {
          var destination = 100;
          var adjustments = 0;
          function check() {
            if (scrollHeaderPanel.headerState === Polymer.PaperScrollHeaderPanel.HEADER_STATE_CONDENSED) {
              assert.notEqual(adjustments, 0);
              done();
              return;
            }
            adjustments++;
            setTimeout(check, 1);
          }
          scrollHeaderPanel.condense(true);
          check();
        });
      });

      test('condense immediately', function(done) {
        flush(function() {
          scrollHeaderPanel.condense();
          assert.equal(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_CONDENSED);
          done();
        });
      });

      test('scroll to top smoothly', function(done) {
        scrollHeaderPanel.scroll(100);

        flush(function() {
          var adjustments = 0;
          function check() {
            if (scrollHeaderPanel.scroller.scrollTop === 0) {
              assert.notEqual(adjustments, 0);
              done();
              return;
            }
            adjustments++;
            setTimeout(check, 0);
          }
          scrollHeaderPanel.scrollToTop(true);
          check();
        });
      });

      test('scroll to top immediately', function(done) {
        scrollHeaderPanel.scroll(100);

        flush(function() {
          assert.equal(scrollHeaderPanel.scroller.scrollTop, 100);

          scrollHeaderPanel.scrollToTop();

          Polymer.Base.async(function() {
            assert.equal(scrollHeaderPanel.scroller.scrollTop, 0);
            done();
          }, 100);
        });
      });

    });