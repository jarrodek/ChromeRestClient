function iconElementFor (node) {
  var nodes = Polymer.dom(node.root).childNodes;

  for (var i = 0; i < nodes.length; ++i) {
    if (nodes[i].nodeName.match(/DIV|IMG/)) {
      return nodes[i];
    }
  }
}

function hasIcon (node) {
  return /png/.test(node.style.backgroundImage);
}

suite('<iron-icon>', function() {
  suite('basic behavior', function() {
    var icon;

    setup(function() {
      icon = fixture('TrivialIcon');
    });

    test('can be assigned an icon with the src attribute', function() {
      expect(iconElementFor(icon)).to.be.ok;
      expect(iconElementFor(icon).src).to.match(/demo\/location\.png/);
    });

    test('can change its src dynamically', function() {
      icon.src = 'foo.png';

      expect(iconElementFor(icon).src).to.match(/foo\.png/);
    });
  });

  suite('when paired with an iconset', function() {
    var icon;

    setup(function() {
      var elements = fixture('IconFromIconset');

      icon = elements[1];
    });

    test('can be assigned an icon from the iconset', function() {
      expect(hasIcon(icon)).to.be.ok;
    });

    test('can change its icon dynamically', function() {
      var style = icon.style;

      expect(style.backgroundPosition).to.match(/0(%|px) 0(%|px)/);

      icon.icon = "example:blank";

      expect(style.backgroundPosition).to.match(/-24px 0(%|px)/);
    });
  });

  suite('when no icon source is provided', function() {
    test('will politely wait for an icon source without throwing', function() {
      document.createElement('iron-icon');
      fixture('WithoutAnIconSource');
    });
  })

  suite('when loading async', function() {
    test('will get icon after iconset is added', function() {
      var icon = fixture('UsingAsyncIconset');
      expect(hasIcon(icon)).to.be.false;
      return new Promise(function(resolve, reject) {
        window.addEventListener('iron-iconset-added', function() {
          if (hasIcon(icon)) {
            resolve();
          } else {
            reject(new Error('icon didn\'t load after iconset loaded'));
          }
        });
        fixture('AsyncIconset');
      });
    });
  });
});