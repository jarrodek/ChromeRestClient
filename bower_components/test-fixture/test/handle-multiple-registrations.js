test('multiple registrations', function() {
      var imports = document.querySelectorAll('link[rel="import"]');
      for (var i = 0; i < imports.length; i++) {
        assert.ok(imports[i].import, 'import loaded');
      }
    });