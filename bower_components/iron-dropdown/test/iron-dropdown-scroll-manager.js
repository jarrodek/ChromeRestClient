suite('IronDropdownScrollManager', function() {
      var parent;
      var childOne;
      var childTwo;
      var grandchildOne;
      var grandchildTwo;
      var ancestor;

      setup(function() {
        parent = fixture('DOMSubtree');
        childOne = parent.querySelector('#ChildOne');
        childTwo = parent.querySelector('#ChildTwo');
        grandChildOne = parent.querySelector('#GrandchildOne');
        grandChildTwo = parent.querySelector('#GrandchildTwo');
        ancestor = document.body;
      });

      suite('contraining scroll in the DOM', function() {
        setup(function() {
          Polymer.IronDropdownScrollManager.pushScrollLock(childOne);
        });

        teardown(function() {
          Polymer.IronDropdownScrollManager.removeScrollLock(childOne);
        });

        test('recognizes sibling as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(childTwo))
            .to.be.equal(true);
        });

        test('recognizes neice as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(grandChildTwo))
            .to.be.equal(true);
        });

        test('recognizes parent as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(parent))
            .to.be.equal(true);
        });

        test('recognizes ancestor as locked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(ancestor))
            .to.be.equal(true);
        });

        test('recognizes locking child as unlocked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(childOne))
            .to.be.equal(false);
        });

        test('recognizes descendant of locking child as unlocked', function() {
          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(grandChildOne))
            .to.be.equal(false);
        });

        test('unlocks locked elements when there are no locking elements', function() {
          Polymer.IronDropdownScrollManager.removeScrollLock(childOne);

          expect(Polymer.IronDropdownScrollManager.elementIsScrollLocked(parent))
            .to.be.equal(false);
        });
      });
    });