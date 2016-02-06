suite('<iron-iconset>', function () {
  suite('basic behavior', function () {
    var iconset;
    var meta;
    var loadedPromise;

    setup(function () {
      loadedPromise = new Promise(function(resolve) {
        window.addEventListener('iron-iconset-added', function(ev) {
          if (ev && ev.detail === iconset) {
            resolve();
          }
        });
      });

      var elements = fixture('TrivialIconset');

      iconset = elements[0];
      meta = elements[1];
    });

    test('it can be accessed via iron-meta', function () {
      expect(meta.byKey('foo')).to.be.equal(iconset);
    });

    test('it fires an iron-iconset-added event on the window', function() {
      return loadedPromise;
    });
  });

  suite('when src, width, iconSize and icons are assigned', function () {
    var iconset;
    var div;

    setup(function () {
      var elements = fixture('StandardIconset');

      iconset = elements[0];
      div = elements[1];
    });

/*
    test('appends a child to the target element', function () {
      expect(div.firstElementChild).to.not.be.ok;

      iconset.applyIcon(div, 'location');

      expect(div.firstElementChild).to.be.ok;
    });
*/

    test('sets the background image of the target element', function () {
      var iconStyle;

      iconset.applyIcon(div, 'location');
      iconStyle = window.getComputedStyle(div);

      expect(iconStyle.backgroundImage).to.match(/url\(.*demo\/my-icons.png["']?\)/);
    });

    test('offsets the background image to the icon\'s position', function () {
      var iconStyle;

      iconset.applyIcon(div, 'bus');
      iconStyle = window.getComputedStyle(div);

      expect(iconStyle.backgroundPosition).to.match(/0(px|%) -24px/);
    });
  });

  suite('when an iconset is themed', function () {
    var iconset;
    var div;

    setup(function () {
      var elements = fixture('ThemedIconset');

      iconset = elements[0];
      div = elements[1];
    });

    test('can use a theme when applying icon', function () {
      iconset.applyIcon(div, 'bus', 'large');

      expect(div).to.be.ok;
    });

    test('adjusts the icon by the theme offset', function () {
      var iconStyle;

      iconset.applyIcon(div, 'bus', 'large');
      iconStyle = window.getComputedStyle(div);

      expect(iconStyle.backgroundPosition).to.match(/-10px -34px/);
    });
  });
});