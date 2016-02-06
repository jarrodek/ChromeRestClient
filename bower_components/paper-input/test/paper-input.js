suite('basic', function() {

      test('setting value sets the input value', function() {
        var input = fixture('basic');
        input.value = 'foobar';
        assert.equal(input.inputElement.value, input.value, 'inputElement.value equals input.value');
      });

      test('placeholder does not overlap label', function() {
        var input = fixture('placeholder');
        assert.equal(input.inputElement.placeholder, input.placeholder, 'inputElement.placeholder equals input.placeholder');
        assert.equal(input.noLabelFloat, false);
        var floatingLabel = Polymer.dom(Polymer.dom(input.root).querySelector('paper-input-container').root).querySelector('.label-is-floating');
        assert.ok(floatingLabel);
      });

      test('special types autofloat the label', function() {
        var input = fixture('date');
        // Browsers that don't support special <input> types like `date` fallback
        // to `text`, so make sure to only test if type is still preserved after
        // the element is attached.
        if (input.inputElement.type === "date") {
          assert.equal(input.alwaysFloatLabel, true);
          var floatingLabel = Polymer.dom(Polymer.dom(input.root).querySelector('paper-input-container').root).querySelector('.label-is-floating');
          assert.ok(floatingLabel);
        }
      });

      test('always-float-label attribute works without placeholder', function() {
        var input = fixture('always-float-label');
        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        var inputContent = Polymer.dom(container.root).querySelector('.input-content');
        assert.isTrue(inputContent.classList.contains('label-is-floating'), 'label is floating');
      });

      test('error message is displayed', function() {
        var input = fixture('error');
        forceXIfStamp(input);
        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.notEqual(getComputedStyle(error).display, 'none', 'error is not display:none');
      });

      test('empty required input shows error', function() {
        var input = fixture('required');
        forceXIfStamp(input);
        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.notEqual(getComputedStyle(error).display, 'none', 'error is not display:none');
      });

      test('character counter is displayed', function() {
        var input = fixture('char-counter');
        forceXIfStamp(input);
        var counter = Polymer.dom(input.root).querySelector('paper-input-char-counter')
        assert.ok(counter, 'paper-input-char-counter exists');
        assert.equal(counter._charCounterStr, input.value.length, 'character counter shows the value length');
      });

      test('validator is used', function() {
        var input = fixture('validator');
        assert.ok(input.inputElement.invalid, 'input is invalid');
      });

      test('caret position is preserved', function() {
        var input = fixture('basic');
        var ironInput = Polymer.dom(input.root).querySelector('input[is="iron-input"]');
        input.value = 'nananana';
        ironInput.selectionStart = 2;
        ironInput.selectionEnd = 2;

        input.updateValueAndPreserveCaret('nanananabatman');

        assert.equal(ironInput.selectionStart, 2, 'selectionStart is preserved');
        assert.equal(ironInput.selectionEnd, 2, 'selectionEnd is preserved');
      });

    });

    suite('focus/blur events', function() {
      var input;

      setup(function() {
        input = fixture('basic');
      });

      test('focus/blur events fired on host element', function() {
        var nFocusEvents = 0;
        var nBlurEvents = 0;
        input.addEventListener('focus', function(event) {
          nFocusEvents += 1;
          assert(input.focused, 'input is focused');
          MockInteractions.blur(input.inputElement);
        });
        input.addEventListener('blur', function() {
          nBlurEvents += 1;
          assert(!input.focused, 'input is blurred');
        });
        MockInteractions.focus(input.inputElement);
        assert.isTrue(nFocusEvents >= 1, 'focus event fired');
        assert.isTrue(nBlurEvents >= 1, 'blur event fired');
      });

    });

    suite('focused styling (integration test)', function() {

      test('underline is colored when input is focused', function(done) {
        var input = fixture('basic');
        var container = Polymer.dom(input.root).querySelector('paper-input-container');
        var line = Polymer.dom(container.root).querySelector('.underline');
        assert.isFalse(line.classList.contains('is-highlighted'), 'line is not highlighted when input is not focused');
        MockInteractions.focus(input.inputElement);
        requestAnimationFrame(function() {
          assert.isTrue(line.classList.contains('is-highlighted'), 'line is highlighted when input is focused');
          done();
        });
      });

    });

    suite('validation', function() {

      test('invalid attribute updated after calling validate()', function() {
        var input = fixture('required-no-auto-validate');
        forceXIfStamp(input);
        input.validate();
        var error = Polymer.dom(input.root).querySelector('paper-input-error');
        assert.ok(error, 'paper-input-error exists');
        assert.notEqual(getComputedStyle(error).display, 'none', 'error is not display:none');
        assert.isTrue(input.invalid, 'invalid is true');
      });

    });

    suite('a11y', function() {

      test('has aria-labelledby', function() {
        var input = fixture('label');
        assert.isTrue(input.inputElement.hasAttribute('aria-labelledby'))
        assert.equal(input.inputElement.getAttribute('aria-labelledby'), Polymer.dom(input.root).querySelector('label').id, 'aria-labelledby points to the label');
      });

      test('has aria-describedby for error message', function() {
        var input = fixture('required');
        forceXIfStamp(input);
        assert.isTrue(input.inputElement.hasAttribute('aria-describedby'));
        assert.equal(input.inputElement.getAttribute('aria-describedby'), Polymer.dom(input.root).querySelector('paper-input-error').id, 'aria-describedby points to the error message');
      });

      test('has aria-describedby for character counter', function() {
        var input = fixture('char-counter');
        forceXIfStamp(input);
        assert.isTrue(input.inputElement.hasAttribute('aria-describedby'));
        assert.equal(input.inputElement.getAttribute('aria-describedby'), Polymer.dom(input.root).querySelector('paper-input-char-counter').id, 'aria-describedby points to the character counter');
      });

      test('has aria-describedby for character counter and error', function() {
        var input = fixture('required-char-counter');
        forceXIfStamp(input);
        assert.isTrue(input.inputElement.hasAttribute('aria-describedby'));
        assert.equal(input.inputElement.getAttribute('aria-describedby'), Polymer.dom(input.root).querySelector('paper-input-error').id + ' ' + Polymer.dom(input.root).querySelector('paper-input-char-counter').id, 'aria-describedby points to the error message and character counter');
      });

      test('focus an input with tabindex', function(done) {
        var input = fixture('has-tabindex');
        flush(function() {
          MockInteractions.focus(input);
          flush(function() {
            assert.equal(input.shadowRoot ? input.shadowRoot.activeElement :
                document.activeElement, input._focusableElement);
            done();
          });
        });
      });
    });