suite('menu a11y tests', function() {

        test('menu has role="menu"', function() {
          var menu = fixture('basic');
          assert.equal(menu.getAttribute('role'), 'menu', 'has role="menu"');
        });

        test('first item gets focus when menu is focused', function(done) {
          var menu = fixture('basic');
          menu.focus();
          setTimeout(function() {
            assert.equal(document.activeElement, menu.firstElementChild, 'document.activeElement is first item')
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('selected item gets focus when menu is focused', function(done) {
          var menu = fixture('basic');
          menu.selected = 1;
          menu.focus();
          setTimeout(function() {
            assert.equal(document.activeElement, menu.selectedItem, 'document.activeElement is selected item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('last activated item in a multi select menu is focused', function(done) {
          var menu = fixture('multi');
          menu.selected = 0;
          menu.items[1].click();
          setTimeout(function() {
            assert.equal(document.activeElement, menu.items[1], 'document.activeElement is last activated item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('deselection in a multi select menu focuses deselected item', function(done) {
          var menu = fixture('multi');
          menu.selected = 0;
          menu.items[0].click();
          setTimeout(function() {
            assert.equal(document.activeElement, menu.items[0], 'document.activeElement is last activated item');
            done();
          // wait for async in _onFocus
          }, 200);
        });

        test('keyboard events should not bubble', function(done) {
          var menu = fixture('nested');
          var keyCounter = 0;

          menu.addEventListener('keydown', function(event) {
            if (menu.keyboardEventMatchesKeys(event, 'esc')) {
              keyCounter++;
            }
            if (menu.keyboardEventMatchesKeys(event, 'up')) {
              keyCounter++;
            }
            if (menu.keyboardEventMatchesKeys(event, 'down')) {
              keyCounter++;
            }
          });

          // up
          MockInteractions.keyDownOn(menu.firstElementChild, 38);
          // down
          MockInteractions.keyDownOn(menu.firstElementChild, 40);
          // esc
          MockInteractions.keyDownOn(menu.firstElementChild, 27);

          setTimeout(function() {
            assert.equal(menu.firstElementChild.tagName, 'TEST-MENU');
            assert.equal(keyCounter, 0);
            done();
          }, 200);
        });

      });