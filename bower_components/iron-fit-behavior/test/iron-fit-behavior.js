function makeScrolling(el) {
        el.classList.add('scrolling');
        var template = document.getElementById('ipsum');
        for (var i = 0; i < 20; i++) {
          el.appendChild(template.content.cloneNode(true));
        }
      }

      suite('manual positioning', function() {

        test('css positioned element is not re-positioned', function() {
          var el = fixture('positioned-xy');
          var rect = el.getBoundingClientRect();
          assert.equal(rect.top, 100, 'top is unset');
          assert.equal(rect.left, 100, 'left is unset');

        });

        test('inline positioned element is not re-positioned', function() {
          var el = fixture('inline-positioned-xy');
          var rect = el.getBoundingClientRect();
          // need to measure document.body here because mocha sets a min-width on html,body, and
          // the element is positioned wrt to that by css
          var bodyRect = document.body.getBoundingClientRect();
          assert.equal(rect.top, 100, 'top is unset');
          assert.equal(rect.left, 100, 'left is unset');

          el.refit();

          rect = el.getBoundingClientRect();
          assert.equal(rect.top, 100, 'top is unset after refit');
          assert.equal(rect.left, 100, 'left is unset after refit');

        });

        test('position property is preserved after', function() {
          var el = fixture('absolute');
          assert.equal(getComputedStyle(el).position, 'absolute', 'position:absolute is preserved');
        });
      });

      suite('fit to window', function() {

        test('sized element is centered in viewport', function() {
          var el = fixture('sized-xy');
          var rect = el.getBoundingClientRect();
          assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
          assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
        });

        test('sized element with margin is centered in viewport', function() {
          var el = fixture('sized-xy');
          el.classList.add('with-margin');
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
          assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
        });

        test('scrolling element is centered in viewport', function() {
          var el = fixture('sized-x');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
          assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
        });

        test('scrolling element is constrained to viewport height', function() {
          var el = fixture('sized-x');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight, 'height is less than or equal to viewport height');
        });

        test('scrolling element with offscreen container is constrained to viewport height', function() {
          var container = fixture('offscreen-container');
          var el = Polymer.dom(container).querySelector('.el')
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight, 'height is less than or equal to viewport height');
        });

        test('scrolling element with max-height is centered in viewport', function() {
          var el = fixture('sized-x');
          el.classList.add('with-max-height');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
          assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
        });

        test('scrolling element with max-height respects max-height', function() {
          var el = fixture('sized-x');
          el.classList.add('with-max-height');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= 500, 'height is less than or equal to max-height');
        });

        test('css positioned, scrolling element is constrained to viewport height (top,left)', function() {
          var el = fixture('positioned-xy');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight - 100, 'height is less than or equal to viewport height');
        });

        test('css positioned, scrolling element is constrained to viewport height (bottom, right)', function() {
          var el = fixture('sized-x');
          el.classList.add('positioned-bottom');
          el.classList.add('positioned-right');
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight - 100, 'height is less than or equal to viewport height');
        });

        test('sized, scrolling element with margin is centered in viewport', function() {
          var el = fixture('sized-x');
          el.classList.add('with-margin');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.closeTo(rect.left - (window.innerWidth - rect.right), 0, 5, 'centered horizontally');
          assert.closeTo(rect.top - (window.innerHeight - rect.bottom), 0, 5, 'centered vertically');
        });

        test('sized, scrolling element is constrained to viewport height', function() {
          var el = fixture('sized-x');
          el.classList.add('with-margin');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight - 20 * 2, 'height is less than or equal to viewport height');
        });

        test('css positioned, scrolling element with margin is constrained to viewport height (top, left)', function() {
          var el = fixture('positioned-xy');
          el.classList.add('with-margin');
          makeScrolling(el);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight - 100 - 20 * 2, 'height is less than or equal to viewport height');
        });

        test('css positioned, scrolling element with margin is constrained to viewport height (bottom, right)', function() {
          var el = fixture('sized-x');
          el.classList.add('positioned-bottom');
          el.classList.add('positioned-right');
          el.classList.add('with-margin')
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight - 100 - 20 * 2, 'height is less than or equal to viewport height');
        });

        test('scrolling sizingTarget is constrained to viewport height', function() {
          el = fixture('sectioned');
          var internal = Polymer.dom(el).querySelector('.internal');
          el.sizingTarget = internal;
          makeScrolling(internal);
          el.refit();
          var rect = el.getBoundingClientRect();
          assert.isTrue(rect.height <= window.innerHeight, 'height is less than or equal to viewport height');
        });

      });

      suite('fit to element', function() {

        test('element fits in another element', function() {
          var constrain = fixture('constrain-target');
          var el = Polymer.dom(constrain).querySelector('.el')
          makeScrolling(el);
          el.fitInto = constrain;
          el.refit();
          var rect = el.getBoundingClientRect();
          var crect = constrain.getBoundingClientRect();
          assert.isTrue(rect.height <= crect.height, 'width is less than or equal to fitInto width');
          assert.isTrue(rect.height <= crect.height, 'height is less than or equal to fitInto height');
        });

        test('element centers in another element', function() {
          var constrain = fixture('constrain-target');
          var el = Polymer.dom(constrain).querySelector('.el')
          makeScrolling(el);
          el.fitInto = constrain;
          el.refit();
          var rect = el.getBoundingClientRect();
          var crect = constrain.getBoundingClientRect();
          assert.closeTo(rect.left - crect.left - (crect.right - rect.right), 0, 5, 'centered horizontally in fitInto');
          assert.closeTo(rect.top - crect.top - (crect.bottom - rect.bottom), 0, 5, 'centered vertically in fitInto');
        });

      });