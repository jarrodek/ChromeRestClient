suite('`headerState`', function() {
      var scrollHeaderPanel, toolbar;

      setup(function() {
        scrollHeaderPanel = fixture('trivialProgress');
        toolbar = Polymer.dom(scrollHeaderPanel).querySelector('paper-toolbar');
        scrollHeaderPanel.measureHeaderHeight();
        scrollHeaderPanel.scroll(0);
      });

      test('HEADER_STATE_EXPANDED', function(done) {
        assert.equal(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_EXPANDED);

        scrollHeaderPanel.scroll(1);

        flush(function() {
          assert.notEqual(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_EXPANDED);
          done();
        });
      });

      test('HEADER_STATE_HIDDEN', function(done) {
        scrollHeaderPanel.scroll(toolbar.offsetHeight + 1);

        //flush(function() {
          assert.equal(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_HIDDEN);
          done();
        //});
      });

      test('HEADER_STATE_CONDENSED', function(done) {
        scrollHeaderPanel.scroll(toolbar.offsetHeight - scrollHeaderPanel.condensedHeaderHeight);

        setTimeout(function() {
          assert.equal(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_CONDENSED);
          done();
        }, 100);
      });

      test('HEADER_STATE_INTERPOLATED', function(done) {
        scrollHeaderPanel.scroll(1);

        flush(function() {
          assert.equal(scrollHeaderPanel.headerState, Polymer.PaperScrollHeaderPanel.HEADER_STATE_INTERPOLATED);
          done();
        });
      });
    });