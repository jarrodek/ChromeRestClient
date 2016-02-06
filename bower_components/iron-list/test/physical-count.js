suite('dynamic physical count', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialList');
        list = container.list;
        list.items = buildDataSet(200);
      });

      test('increase pool size', function(done) {
        setTimeout(function() {
          var lastItem = getLastItemFromList(list);
          var lastItemHeight = lastItem.offsetHeight;
          var expectedFinalItem = container.listHeight/lastItemHeight;

          assert.equal(list.offsetHeight, container.listHeight);
          assert.equal(lastItemHeight, 2);
          assert.equal(getLastItemFromList(list).textContent, expectedFinalItem);
          done();
        }, 100);
      });
    });

    suite('iron-resize', function() {
      var list, container;

      setup(function() {
        container = fixture('trivialListSmall');
        list = container.list;
        list.items = buildDataSet(200);
      });

      test('increase pool size after resizing the list', function(done) {
        flush(function() {
          list.fire('iron-resize');
          setTimeout(function() {
            var lastItem = getLastItemFromList(list);
            var lastItemHeight = lastItem.offsetHeight;
            var expectedFinalItem = container.listHeight/lastItemHeight;

            assert.equal(list.offsetHeight, container.listHeight);
            assert.equal(lastItemHeight, 2);
            assert.equal(getLastItemFromList(list).textContent, expectedFinalItem);
            done();
          }, 100);
        });
      });
    });