suite('basic features', function() {
      var scrollHeaderPanel, toolbar, content;

      setup(function() {
        scrollHeaderPanel = fixture('trivialProgress');

        toolbar = Polymer.dom(scrollHeaderPanel).querySelector('paper-toolbar');
        content = Polymer.dom(scrollHeaderPanel).querySelector('.content');
      });

      test('check default', function() {
        assert.equal(scrollHeaderPanel.header, toolbar);
        assert.equal(scrollHeaderPanel.content, content);
        assert.equal(scrollHeaderPanel.condenses, false);
        assert.equal(scrollHeaderPanel.noReveal, false);
        assert.equal(scrollHeaderPanel.fixed, false);
        assert.typeOf(scrollHeaderPanel.scroller, 'object');
        assert.equal(scrollHeaderPanel.keepCondensedHeader, false);
        assert.equal(scrollHeaderPanel.keepCondensedHeader, false);

        scrollHeaderPanel.measureHeaderHeight();
        assert.equal(scrollHeaderPanel.headerHeight, toolbar.offsetHeight);
        assert.equal(scrollHeaderPanel.condensedHeaderHeight, Math.round(toolbar.offsetHeight * 1/3));
      });

      test('condensation', function(done) {
        var top1 = toolbar.getBoundingClientRect().top;

        scrollHeaderPanel.condenses = true;
        scrollHeaderPanel.headerHeight = 150;
        scrollHeaderPanel.condensedHeaderHeight = 50;
        scrollHeaderPanel.scroller.scrollTop = 300;

        flush(function() {
          assert.notEqual(top1, toolbar.getBoundingClientRect().top)
          done();
        });
      });

      test('paper-header-transform event', function(done) {
        scrollHeaderPanel.condenses = false;
        scrollHeaderPanel.headerHeight = scrollHeaderPanel.headerHeight || 150;

        scrollHeaderPanel.addEventListener('paper-header-transform', function(e) {
          assert.typeOf(e.detail.y, 'number');
          assert.equal(e.detail.height, scrollHeaderPanel.headerHeight);
          assert.equal(e.detail.condensedHeight, scrollHeaderPanel.condensedHeaderHeight);
          done();
        });

        flush(function() {
          scrollHeaderPanel.scroller.scrollTop = 300;
        });
      });

      test('content-scroll event', function(done) {
        scrollHeaderPanel.condenses = false;

        scrollHeaderPanel.addEventListener('content-scroll', function(e) {
          assert.equal(e.detail.target, scrollHeaderPanel.scroller);
          done();
        });

        flush(function() {
          scrollHeaderPanel.scroller.scrollTop = 300;
        });
      });

      test('custom `condensedHeaderHeight`', function(done) {
        var CUSTOM_HEIGHT = 100;
        scrollHeaderPanel.condensedHeaderHeight = CUSTOM_HEIGHT;
        scrollHeaderPanel.headerHeight = CUSTOM_HEIGHT;

        assert.equal(scrollHeaderPanel.condensedHeaderHeight, CUSTOM_HEIGHT);
        assert.equal(scrollHeaderPanel.headerHeight, CUSTOM_HEIGHT);


        done();

      });
    });