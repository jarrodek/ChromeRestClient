suite('positioning', function() {

      test('drawer is positioned correctly', function(done) {
        var f, drawer, main;
        f = fixture('left-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        Polymer.Base.async(function() {
          var drawerStyle = window.getComputedStyle(drawer);
          expect(drawerStyle.left).to.be.equal('0px');
          try {
            expect(drawerStyle.right).to.be.equal('auto');
          } catch(e) {
            // Firefox
            expect(drawerStyle.right).to.be.equal(f.offsetWidth - drawer.offsetWidth + 'px');
          }
          done();
        });
      });

      test('right-drawer is positioned correctly', function(done) {
        var f, drawer, main;
        f = fixture('right-drawer');
        drawer = f.$$('#drawer');
        main = f.$$('#main');

        Polymer.Base.async(function() {
          var drawerStyle = window.getComputedStyle(drawer);
          expect(drawerStyle.right).to.be.equal('0px');

          try {
            expect(drawerStyle.left).to.be.equal('auto');
          } catch(e) {
            // Firefox
            expect(drawerStyle.left).to.be.equal(f.offsetWidth - drawer.offsetWidth + 'px');
          }

          done();
        });
      });

    });