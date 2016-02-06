suite('<paper-menu-button>', function() {
      var menuButton;
      var trigger;
      var content;

      setup(function() {
        menuButton = fixture('TrivialMenuButton');
        trigger = Polymer.dom(menuButton).querySelector('.dropdown-trigger');
        content = Polymer.dom(menuButton).querySelector('.dropdown-content');
      });

      test('opens when trigger is clicked', function(done) {
        var contentRect;

        contentRect = content.getBoundingClientRect();

        expect(contentRect.width).to.be.equal(0);
        expect(contentRect.height).to.be.equal(0);

        MockInteractions.tap(trigger);

        Polymer.Base.async(function() {
          contentRect = content.getBoundingClientRect();

          expect(menuButton.opened).to.be.equal(true);

          expect(contentRect.width).to.be.greaterThan(0);
          expect(contentRect.height).to.be.greaterThan(0);
          done();
        });
      });

      test('closes when trigger is clicked again', function(done) {
        MockInteractions.tap(trigger);

        Polymer.Base.async(function() {

          MockInteractions.tap(trigger);

          Polymer.Base.async(function() {
            var contentRect = content.getBoundingClientRect();

            expect(menuButton.opened).to.be.equal(false);

            expect(contentRect.width).to.be.equal(0);
            expect(contentRect.height).to.be.equal(0);

            done();
          }, Polymer.PaperMenuButton.MAX_ANIMATION_TIME_MS);
        }, 100);
      });

      test('closes when disabled while open', function() {
        var contentRect;

        menuButton.opened = true;
        menuButton.disabled = true;

        expect(menuButton.opened).to.be.equal(false);

        contentRect = content.getBoundingClientRect();
        expect(contentRect.width).to.be.equal(0);
        expect(contentRect.height).to.be.equal(0);
      });

      test('has aria-haspopup attribute', function() {
        expect(menuButton.hasAttribute('aria-haspopup')).to.be.equal(true);
      });
    });