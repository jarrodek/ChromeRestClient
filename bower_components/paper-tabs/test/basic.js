function checkSelectionBar(tabs, tab) {
        var tabRect = tab.getBoundingClientRect();
        var rect = Polymer.dom(tabs.root).querySelector('#selectionBar').getBoundingClientRect();
        assert.equal(Math.round(tabRect.left), Math.round(rect.left));
      }

      suite('defaults', function() {

        var tabs;

        setup(function () {
          tabs = fixture('basic');
        });

        test('to nothing selected', function() {
          assert.equal(tabs.selected, undefined);
        });

        test('no tabs have iron-selected class', function() {
          Array.prototype.forEach.call(tabs.querySelectorAll('paper-tab'), function(tab) {
            assert.isFalse(tab.classList.contains('iron-selected'));
          });
        });

        test('to false as noink', function() {
          assert.equal(tabs.noink, false);
        });

        test('to false as noBar', function() {
          assert.equal(tabs.noBar, false);
        });

        test('to false as noSlide', function() {
          assert.equal(tabs.noSlide, false);
        });

        test('to false as scrollable', function() {
          assert.equal(tabs.scrollable, false);
        });

        test('to false as disableDrag', function() {
          assert.equal(tabs.disableDrag, false);
        });

        test('to false as hideScrollButtons', function() {
          assert.equal(tabs.hideScrollButtons, false);
        });

        test('to false as alignBottom', function() {
          assert.equal(tabs.alignBottom, false);
        });

        test('has role tablist', function() {
          assert.equal(tabs.getAttribute('role'), 'tablist');
        });
      });

      suite('hidden tabs', function() {
        var tabs;

        setup(function() {
          tabs = fixture('HiddenTabs');
        });

        test('choose the correct bar position once made visible', function() {
          tabs.removeAttribute('hidden');
          tabs.selected = 0;
          expect(tabs._width).to.be.greaterThan(0);
          expect(tabs._left).to.be.equal(0);
        });
      });

      suite('set the selected attribute', function() {

        var tabs, index = 0;

        setup(function () {
          tabs = fixture('basic');
          tabs.selected = index;
        });

        test('selected value', function() {
          assert.equal(tabs.selected, index);
        });

        test('selected tab has iron-selected class', function() {
          var tab = tabs.querySelectorAll('paper-tab')[index];
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

        test('selected tab has selection bar position at the bottom of the tab', function(done) {
          setTimeout(function() {
            checkSelectionBar(tabs, tabs.querySelectorAll('paper-tab')[index]);
            done();
          }, 1000);
        });

      });

      suite('select tab via click', function() {

        var tabs, index = 1;
        var tab;

        setup(function () {
          tabs = fixture('basic');
          tab = tabs.querySelectorAll('paper-tab')[index];
          tab.dispatchEvent(new CustomEvent('click', {bubbles: true}));
        });

        test('selected value', function() {
          assert.equal(tabs.selected, index);
        });

        test('selected tab has iron-selected class', function() {
          var tab = tabs.querySelectorAll('paper-tab')[index];
          assert.isTrue(tab.classList.contains('iron-selected'));
        });

        test('selected tab has selection bar position at the bottom of the tab', function(done) {
          setTimeout(function() {
            checkSelectionBar(tabs, tabs.querySelectorAll('paper-tab')[index]);
            done();
          }, 1000);
        });

        test('pressing enter on tab causes a click', function(done) {
          var clickCount = 0;
          tab.addEventListener('click', function onTabClick() {
            clickCount++;
            tab.removeEventListener('click', onTabClick);

            expect(clickCount).to.be.equal(1);
            done();
          });

          MockInteractions.pressEnter(tab);
        });
      });

      suite('noink attribute', function() {
        var tabs;

        setup(function () {
          tabs = fixture('basic');
        });

        test('noink attribute propagates to all descendant tabs', function() {
          tabs.noink = true;
          Array.prototype.slice.apply(tabs.querySelectorAll('paper-tab')).forEach(function(tab) {
            assert.isTrue(tab.noink);
          });

          tabs.noink = false;
          Array.prototype.slice.apply(tabs.querySelectorAll('paper-tab')).forEach(function(tab) {
            assert.isFalse(tab.noink);
          });
        });
      });