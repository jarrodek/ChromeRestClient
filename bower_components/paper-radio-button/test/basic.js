suite('defaults', function() {
      var r1;

      setup(function() {
        r1 = fixture('NoLabel');
      });

      test('check button via click', function(done) {
        r1.addEventListener('click', function() {
          assert.isTrue(r1.getAttribute('aria-checked') == 'true');
          assert.isTrue(r1.checked);
          done();
        });
        MockInteractions.tap(r1);
      });

      test('toggle button via click', function(done) {
        r1.checked = true;
        r1.addEventListener('click', function() {
          assert.isFalse(r1.getAttribute('aria-checked') == 'true');
          assert.isFalse(r1.checked);
          done();
        });
        MockInteractions.tap(r1);
      });

      test('disabled button cannot be clicked', function(done) {
        r1.disabled = true;
        r1.checked = true;
        MockInteractions.tap(r1);

        setTimeout(function() {
          assert.isTrue(r1.getAttribute('aria-checked') == 'true');
          assert.isTrue(r1.checked);
          done();
        }, 1);
      });
    });

    suite('a11y', function() {
      var r1;
      var r2;

      setup(function() {
        r1 = fixture('NoLabel');
        r2 = fixture('WithLabel');
      });

      test('has aria role "radio"', function() {
        assert.isTrue(r1.getAttribute('role') == 'radio');
        assert.isTrue(r2.getAttribute('role') == 'radio');
      });

      test('button with no label has no aria label', function() {
        assert.isTrue(!r1.getAttribute('aria-label'));
      });
      
      test('button respects the user set aria-label', function() {
        var c = fixture('AriaLabel');
        assert.isTrue(c.getAttribute('aria-label') == "Batman");
      });

      a11ySuite('NoLabel');
      a11ySuite('WithLabel');
      a11ySuite('AriaLabel');
    });