suite('dom-repeat', function() {

      var scope, s, t;

      setup(function() {
        scope = document.querySelector('template[is="dom-bind"]');
        s = scope.$.selector;
        t = scope.$.t;
        t.items = [{name:'item0'}, {name: 'item1'}, {name: 'item2'}, {name: 'item3'}];
      });

      teardown(function() {
        t.items = [];
      });

      test('supports repeated items', function(done) {
        setTimeout(function() {
          // check items
          assert.equal(s.items.length, 4);
          // check selected
          assert.equal(s.selected, 1);
          // check selected item
          var item = s.selectedItem;
          assert.equal(s.items[1], item);
          // check selected class
          assert.isTrue(item.classList.contains('iron-selected'));
          done();
        });
      });

      test('update items', function(done) {
        setTimeout(function() {
          // check items
          assert.equal(s.items.length, 4);
          // check selected
          assert.equal(s.selected, 1);
          // update items
          t.items = [{name:'foo'}, {name: 'bar'}];
          setTimeout(function() {
            // check items
            assert.equal(s.items.length, 2);
            // check selected (should still honor the selected)
            assert.equal(s.selected, 1);
            // check selected class
            assert.isTrue(s.querySelector('#bar').classList.contains('iron-selected'));
            done();
          });
        });
      });

      test('set selected to something else', function(done) {
        setTimeout(function() {
          // set selected to something else
          s.selected = 3;
          // check selected item
          var item = s.selectedItem;
          assert.equal(s.items[3], item);
          // check selected class
          assert.isTrue(item.classList.contains('iron-selected'));
          done();
        });
      });

    });