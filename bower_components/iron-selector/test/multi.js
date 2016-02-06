suite('multi', function() {

      var s;

      setup(function () {
        s = fixture('test');
        t = Polymer.dom(s).querySelector('[is="dom-repeat"]');
      });

      test('honors the multi attribute', function() {
        assert.isTrue(s.multi);
      });

      test('has sane defaults', function() {
        assert.equal(s.selectedValues, undefined);
        assert.equal(s.selectedClass, 'iron-selected');
        assert.equal(s.items.length, 5);
      });

      test('set multi-selection via selected property', function() {
        // set selectedValues
        s.selectedValues = [0, 2];
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('set multi-selection via tap', function() {
        // set selectedValues
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        s.children[2].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check selected class
        assert.isTrue(s.children[0].classList.contains('iron-selected'));
        assert.isTrue(s.children[2].classList.contains('iron-selected'));
        // check selectedItems
        assert.equal(s.selectedItems.length, 2);
        assert.equal(s.selectedItems[0], s.children[0]);
        assert.equal(s.selectedItems[1], s.children[2]);
      });

      test('fire iron-select/deselect events', function() {
        // setup listener for iron-select event
        var selectEventCounter = 0;
        s.addEventListener('iron-select', function(e) {
          selectEventCounter++;
        });
        // setup listener for core-deselect event
        var deselectEventCounter = 0;
        s.addEventListener('iron-deselect', function(e) {
          deselectEventCounter++;
        });
        // tap to select an item
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check events
        assert.equal(selectEventCounter, 1);
        assert.equal(deselectEventCounter, 0);
        // tap on already selected item should deselect it
        s.children[0].dispatchEvent(new CustomEvent('tap', {bubbles: true}));
        // check selectedValues
        assert.equal(s.selectedValues.length, 0);
        // check class
        assert.isFalse(s.children[0].classList.contains('iron-selected'));
        // check events
        assert.equal(selectEventCounter, 1);
        assert.equal(deselectEventCounter, 1);
      });

      test('fires selected-values-changed when selection changes', function() {
        var selectedValuesChangedEventCounter = 0;

        s.addEventListener('selected-values-changed', function(e) {
          selectedValuesChangedEventCounter++;
        });

        MockInteractions.tap(Polymer.dom(s).children[0]);
        MockInteractions.tap(Polymer.dom(s).children[0]);
        MockInteractions.tap(Polymer.dom(s).children[0]);

        expect(selectedValuesChangedEventCounter);
      });

      test('selects from items created by dom-repeat', function(done) {
        var selectEventCounter = 0;
        var firstChild;

        s = document.querySelector('#repeatedItems');
        s.addEventListener('iron-select', function(e) {
          selectEventCounter++;
        });

        // NOTE(cdata): I guess `dom-repeat` doesn't stamp synchronously..
        Polymer.Base.async(function() {
          firstChild = Polymer.dom(s).querySelector('div');
          MockInteractions.tap(firstChild);

          assert.equal(s.selectedItems[0].textContent, 'foo');
          done();
        });
      });

      test('updates selection when dom changes', function(done) {
        var selectEventCounter = 0;

        s = fixture('test');

        Polymer.Base.async(function() {
          var firstChild = Polymer.dom(s).querySelector(':first-child');
          var lastChild = Polymer.dom(s).querySelector(':last-child');

          MockInteractions.tap(firstChild);
          MockInteractions.tap(lastChild);

          expect(s.selectedItems.length).to.be.equal(2);

          Polymer.dom(s).removeChild(lastChild);

          Polymer.Base.async(function() {
            expect(s.selectedItems.length).to.be.equal(1);
            done();
          });
        });

      });

      /* test('toggle multi from true to false', function() {
        // set selected
        s.selected = [0, 2];
        var first = s.selected[0];
        // set mutli to false, so to make it single-selection
        s.multi = false;
        // selected should not be an array
        assert.isNotArray(s.selected);
        // selected should be the first value from the old array
        assert.equal(s.selected, first);
      }); */

    });