suite('menubar a11y tests', function() {

        test('menubar has role="menubar"', function() {
          var menubar = fixture('basic');
          assert.equal(menubar.getAttribute('role'), 'menubar', 'has role="menubar"');
        });

        test('first item gets focus when menubar is focused', function(done) {
          var menubar = fixture('basic');
          menubar.focus();
          setTimeout(function() {
            assert.equal(document.activeElement, menubar.firstElementChild, 'document.activeElement is first item')
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('selected item gets focus when menubar is focused', function(done) {
          var menubar = fixture('basic');
          menubar.selected = 1;
          menubar.focus();
          setTimeout(function() {
            assert.equal(document.activeElement, menubar.selectedItem, 'document.activeElement is selected item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('last activated item in a multi select menubar is focused', function(done) {
          var menubar = fixture('multi');
          menubar.selected = 0;
          menubar.items[1].click();
          setTimeout(function() {
            assert.equal(document.activeElement, menubar.items[1], 'document.activeElement is last activated item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('deselection in a multi select menubar focuses deselected item', function(done) {
          var menubar = fixture('multi');
          menubar.selected = 0;
          menubar.items[0].click();
          setTimeout(function() {
            assert.equal(document.activeElement, menubar.items[0], 'document.activeElement is last activated item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

      });