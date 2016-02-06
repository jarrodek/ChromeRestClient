suite('selected attributes', function() {

      var s;

      setup(function () {
        s = fixture('test');
      });

      test('custom selectedAttribute', function() {
        // set selectedAttribute
        s.selectedAttribute = 'myattr';
        // check selected attribute (should not be there)
        assert.isFalse(s.children[4].hasAttribute('myattr'));
        // set selected
        s.selected = 4;
        // now selected attribute should be there
        assert.isTrue(s.children[4].hasAttribute('myattr'));
      });

    });