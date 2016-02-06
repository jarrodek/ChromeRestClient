var storage;

    suite('raw', function() {

      setup(function() {
        window.localStorage.setItem('iron-localstorage-test', 'hello world');
        document.getElementById('fixture').create();
        storage = document.getElementById('localstorage');
        storage.flushDebouncer('reload');
      });

      teardown(function() {
        window.localStorage.removeItem('iron-localstorage-test');
      });

      test('load', function() {
        assert.equal(storage.value, 'hello world');
      });

      test('save', function() {
        var m = 'goodbye';
        storage.value = m;
        storage.flushDebouncer('save');
        var v = window.localStorage.getItem(storage.name);
        assert.equal(v, m);
      });

    });