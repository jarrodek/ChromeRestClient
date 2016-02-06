suite('Different heights', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
      });

      test('render without gaps 1', function(done) {
        list.items = [
          {index: 0, height: 791},
          {index: 1, height: 671}
        ];

        flush(function() {
          list.push('items',
            {index: 2, height: 251},
            {index: 3, height: 191},
            {index: 4, height: 151},
            {index: 5, height: 191},
            {index: 6, height: 51},
            {index: 7, height: 51},
            {index: 8, height: 51}
          );

          list.addEventListener('scroll', function() {
            list.debounce('scroll', function() {
              assert.equal(isFullOfItems(list), true);
            });
          });

          simulateScroll({
            list: list,
            contribution: 20,
            target: 100000
          }, function() {
            done();
          });
        });
      });

       test('render without gaps 2', function(done) {
        var height = 2, items = [];

        while (items.length < 15) {
          items.push({height: height});
          height *= 1.5;
        }
        list.items = items;

        flush(function() {
          list.addEventListener('scroll', function() {
            list.debounce('scroll', function() {
              assert.equal(isFullOfItems(list), true);
            });
          });

          simulateScroll({
            list: list,
            contribution: 20,
            target: 100000
          }, function() {
            done();
          });
        });
      });

      test('render without gaps 3', function(done) {
        var heights = [20, 100, 140, 117, 800, 50, 15, 80, 90, 255, 20, 15, 19, 250, 314];

        list.items = heights.map(function(height) {
          return {height: height};
        });

        flush(function() {
          list.addEventListener('scroll', function() {
            list.debounce('scroll', function() {
              assert.isTrue(isFullOfItems(list));
            });
          });

          simulateScroll({
            list: list,
            contribution: 20,
            target: 100000
          }, function() {
            done();
          });
        });
      });

    });