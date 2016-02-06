suite('basic', function() {
      test('badge is positioned correctly', function(done) {
        var f = fixture('basic');
        var badge = f.querySelector('paper-badge');
        var actualbadge = Polymer.dom(badge.root).querySelector('.badge');

        expect(badge.target.getAttribute('id')).to.be.equal('target');

        badge.updatePosition();

        Polymer.Base.async(function() {
          assert.equal(actualbadge.textContent.trim(), "1");

          var divRect = f.querySelector('#target').getBoundingClientRect();
          expect(divRect.width).to.be.equal(100);
          expect(divRect.height).to.be.equal(20);

          var contentRect = badge.getBoundingClientRect();
          expect(contentRect.width).to.be.equal(20);
          expect(contentRect.height).to.be.equal(20);

          // The target div is 100 x 20, and the badge is centered on the
          // top right corner.
          expect(contentRect.left).to.be.equal(100 - 10);
          expect(contentRect.top).to.be.equal(0 - 10);

          // Also check the math, just in case.
          expect(contentRect.left).to.be.equal(divRect.width - 10);
          expect(contentRect.top).to.be.equal(divRect.top - 10);

          done();
        });
      });

      test('badge is positioned correctly after being dynamically set', function(done) {
        var f = fixture('dynamic');
        var badge = f.querySelector('paper-badge');
        badge.updatePosition();

        expect(badge.target.getAttribute('id')).to.not.be.equal('target');

        Polymer.Base.async(function() {
          var contentRect = badge.getBoundingClientRect();
          expect(contentRect.left).to.not.be.equal(100 - 11);

          badge.for = 'target';
          expect(badge.target.getAttribute('id')).to.be.equal('target');

          badge.updatePosition();

          Polymer.Base.async(function() {
            var divRect = f.querySelector('#target').getBoundingClientRect();
            expect(divRect.width).to.be.equal(100);
            expect(divRect.height).to.be.equal(20);

            var contentRect = badge.getBoundingClientRect();
            expect(contentRect.width).to.be.equal(20);
            expect(contentRect.height).to.be.equal(20);

            // The target div is 100 x 20, and the badge is centered on the
            // top right corner.
            expect(contentRect.left).to.be.equal(100 - 10);
            expect(contentRect.top).to.be.equal(0 - 10);

            // Also check the math, just in case.
            expect(contentRect.left).to.be.equal(divRect.width - 10);
            expect(contentRect.top).to.be.equal(divRect.top - 10);

            done();
          });
        });
      });

      test('badge is positioned correctly when nested in a target element', function(done) {
        var f = fixture('nested');
        var badge = f.querySelector('paper-badge');

        expect(badge.target.getAttribute('id')).to.be.equal('target');

        badge.updatePosition();

        Polymer.Base.async(function() {
          var divRect = f.querySelector('#target').getBoundingClientRect();
          expect(divRect.width).to.be.equal(100);
          expect(divRect.height).to.be.equal(20);

          var contentRect = badge.getBoundingClientRect();
          expect(contentRect.width).to.be.equal(20);
          expect(contentRect.height).to.be.equal(20);

          // The target div is 100 x 20, and the badge is centered on the
          // top right corner.
          expect(contentRect.left).to.be.equal(100 - 10);
          expect(contentRect.top).to.be.equal(0 - 10);

          // Also check the math, just in case.
          expect(contentRect.left).to.be.equal(divRect.width - 10);
          expect(contentRect.top).to.be.equal(divRect.top - 10);

          done();
        });
      });

      test('badge displays icons correctly', function(done) {
        var f = fixture('icon-badge');
        var badge = f.querySelector('paper-badge');

        Polymer.Base.async(function() {
          var icon = Polymer.dom(badge.root).querySelector('iron-icon');
          expect(icon).not.to.be.null;
          expect(icon.icon).to.be.equal(badge.icon);
          expect(badge.getAttribute('aria-label')).to.be.equal(badge.label);
          done();
        });
      });

      suite('badge is inside a custom element', function() {
        test('badge is positioned correctly', function(done) {
          var f = fixture('custom');
          var badge = f.$.badge;
          var actualbadge = Polymer.dom(badge.root).querySelector('.badge');

          badge.updatePosition();

          Polymer.Base.async(function() {
            assert.equal(actualbadge.textContent.trim(), "1");

            var divRect = f.$.button.getBoundingClientRect();
            expect(divRect.width).to.be.equal(100);
            expect(divRect.height).to.be.equal(20);

            var contentRect = badge.getBoundingClientRect();
            expect(contentRect.width).to.be.equal(20);
            expect(contentRect.height).to.be.equal(20);

            // The target div is 100 x 20, and the badge is centered on the
            // top right corner.
            expect(contentRect.left).to.be.equal(100 - 10);
            expect(contentRect.top).to.be.equal(0 - 10);

            // Also check the math, just in case.
            expect(contentRect.left).to.be.equal(divRect.width - 10);
            expect(contentRect.top).to.be.equal(divRect.top - 10);

            done();
          });
        });
      });
    });