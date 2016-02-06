suite('basic', function() {
    });
    suite('notify-resize', function() {
      test('only a destination page recieves a resize event', function(done) {
        var animatedPages = fixture('notify-resize');
        var resizables = Polymer.dom(animatedPages).children;
        var recieves = {};
        resizables.forEach(function(page) {
          page.addEventListener('iron-resize', function(event) {
            var pageName = event.currentTarget.tagName;
            recieves[pageName] = pageName in recieves ? recieves[pageName] + 1 : 1;
          });
        });
        animatedPages.selected = 2;
        setTimeout(function() {
          assert.deepEqual(recieves, {
            'C-RESIZABLE-PAGE': 1
          });
          done();
        }, 50);
      });
    });