var f1;
    var f2;

    function centerOf(element) {
      var rect = element.getBoundingClientRect();
      return {left: rect.left + rect.width / 2, top: rect.top + rect.height / 2};
    }

    function approxEqual(p1, p2) {
      return Math.round(p1.left) == Math.round(p2.left) && Math.round(p1.top) == Math.round(p2.top);
    }

    setup(function() {
      f1 = fixture('TrivialFab').querySelector('#fab1');
      f2 = fixture('SrcFab');
    });

    test('applies an icon specified by the `icon` attribute', function() {
      assert.strictEqual(!!f1.$.icon.usesSrcAttribute, false);
      assert.ok(Polymer.dom(f1.$.icon.root).querySelector('svg'));
    });

    test('applies an icon specified by the `src` attribute', function() {
      assert.strictEqual(f2.$.icon._usesIconset(), false);
      assert.ok(f2.$.icon._img);
    });

    test('renders correctly independent of line height', function() {
      assert.ok(approxEqual(centerOf(f1.$.icon), centerOf(f1)));
    });