suite('native elements', function() {
      test('dragging less than halfway does not swipe', function(done) {
        var container = fixture('basic');
        var element = container.querySelector('#native');

        Polymer.Base.async(function() {
          var swipeEventHandler = sinon.spy();
          container.addEventListener('iron-swipe', swipeEventHandler);

          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 10, 0);

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });

      test('dragging more than halfway swipes it', function(done) {
        var container = fixture('basic');
        var element = container.querySelector('#native');

        Polymer.Base.async(function() {
          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);

          container.addEventListener('iron-swipe', function(event) {
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(1);
            done();
          });

          MockInteractions.track(element, 60, 0);
        });
      });

      test('an element with disable-swipe cannot be swiped', function(done) {
        var container = fixture('child-no-swipe');
        var element = container.querySelector('#native');

        Polymer.Base.async(function() {
          var swipeEventHandler = sinon.spy();
          container.addEventListener('iron-swipe', swipeEventHandler);

          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 60, 0);  // this amount would normally swipe.

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });
    });

    suite('custom elements', function() {
      test('dragging less than halfway does not swipe', function(done) {
        var container = fixture('basic');
        var element = container.querySelector('#custom');

        var swipeEventHandler = sinon.spy();
        container.addEventListener('iron-swipe', swipeEventHandler);

        Polymer.Base.async(function() {
          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 10, 0);

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });

      test('dragging more than halfway swipes it', function(done) {
        var container = fixture('basic');
        var element = container.querySelector('#custom');

        Polymer.Base.async(function() {
          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);

          container.addEventListener('iron-swipe', function(event) {
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(1);
            done();
          });

          MockInteractions.track(element, 60, 0);
        });
      });

      test('an element with disable-swipe cannot be swiped', function(done) {
        var container = fixture('child-no-swipe');
        var element = container.querySelector('#custom');

        Polymer.Base.async(function() {
          var swipeEventHandler = sinon.spy();
          container.addEventListener('iron-swipe', swipeEventHandler);

          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 60, 0);  // this amount would normally swipe.

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });
    });

    suite('no swipe', function() {
      test('dragging a native element more than halfway does not swipe', function(done) {
        var container = fixture('no-swipe');
        var element = container.querySelector('#native');

        var swipeEventHandler = sinon.spy();
        container.addEventListener('iron-swipe', swipeEventHandler);

        Polymer.Base.async(function() {
          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 60, 0);

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });

      test('dragging a custom element more than halfway does not swipe', function(done) {
        var container = fixture('no-swipe');
        var element = container.querySelector('#custom');

        var swipeEventHandler = sinon.spy();
        container.addEventListener('iron-swipe', swipeEventHandler);

        Polymer.Base.async(function() {
          expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
          MockInteractions.track(element, 60, 0);

          Polymer.Base.async(function(){
            expect(swipeEventHandler.callCount).to.be.equal(0);
            expect(Polymer.dom(container).queryDistributedElements('*').length).to.be.equal(2);
            done();
          }, 1);
        });
      });
    });