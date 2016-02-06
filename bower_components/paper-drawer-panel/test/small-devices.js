suite('on small devices', function() {

      test('drawer is hidden by default', function(done) {
        var f, panel, drawer, main;
        f = fixture('left-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        f.set('forceNarrow', true);
        f._forceNarrowChanged();

        Polymer.Base.async(function() {
          var drawerBoundingRect = drawer.getBoundingClientRect();
          var mainStyle = window.getComputedStyle(main);
          expect(f._isMainSelected()).to.be.equal(true);
          expect(drawerBoundingRect.left).to.be.equal(-256);
          expect(drawerBoundingRect.width).to.be.equal(256);
          done();
        });
      });

      test('right-drawer is hidden by default', function(done) {
        var f, panel, drawer, main;
        f = fixture('right-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        f.set('forceNarrow', true);
        f._forceNarrowChanged();

        Polymer.Base.async(function() {
          var drawerBoundingRect = drawer.getBoundingClientRect();
          var mainStyle = window.getComputedStyle(main);
          expect(drawerBoundingRect.right).to.be.equal(f.offsetWidth + 256);
          expect(drawerBoundingRect.width).to.be.equal(256);
          done();
        });
      });

     test('drawer can be opened', function(done) {
        var f, panel, drawer, main;
        f = fixture('left-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        f.set('forceNarrow', true);
        f._forceNarrowChanged();
        f.openDrawer();

        Polymer.Base.async(function() {
          var drawerBoundingRect = drawer.getBoundingClientRect();
          var mainStyle = window.getComputedStyle(main);
          expect(f.selected).to.be.equal('drawer');
          expect(f._isMainSelected()).to.be.equal(false);
          expect(drawerBoundingRect.left).to.be.equal(0);
          expect(drawerBoundingRect.width).to.be.equal(256);
          done();
        });
      });

      test('right-drawer can be closed', function(done) {
        var f, panel, drawer, main;
        f = fixture('right-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        f.set('forceNarrow', true);
        f._forceNarrowChanged();
        f.openDrawer();

        Polymer.Base.async(function() {
          var drawerBoundingRect = drawer.getBoundingClientRect();
          var mainStyle = window.getComputedStyle(main);
          expect(drawerBoundingRect.right).to.be.equal(f.offsetWidth);
          expect(drawerBoundingRect.width).to.be.equal(256);
          done();
        });
      });

    });