var storage;

    suite('basic', function() {

      setup(function() {
        window.localStorage.setItem('iron-localstorage-test', '{"foo":"bar"}');
        storage = document.getElementById('fixture').create();
        storage.flushDebouncer('reload');
      });

      teardown(function() {
        window.localStorage.removeItem('iron-localstorage-test');
      });

      test('load', function() {
        assert.isNotNull(storage.value);
        assert.equal(storage.value.foo, 'bar');
      });

      test('save', function() {
        var newValue = {'foo': 'zot'};
        storage.value = newValue;
        storage.flushDebouncer('save');
        var v = window.localStorage.getItem(storage.name);
        v = JSON.parse(v);
        assert.equal(v.foo, newValue.foo);
      });

      test('delete', function() {
        storage.value = null;
        storage.flushDebouncer('save');
        var v = window.localStorage.getItem(storage.name);
        assert.isNull(v);
        storage.value = undefined;
        storage.flushDebouncer('save');
        var v = window.localStorage.getItem(storage.name);
        assert.isNull(v);
      });

      test('event iron-localstorage-load', function(done) {
        var ls = document.createElement('iron-localstorage');
        ls.addEventListener('iron-localstorage-load', function() {
          done();
        });
        ls.name = 'iron-localstorage-test';
      });

      test('event iron-localstorage-load-empty', function(done) {
        window.localStorage.removeItem('iron-localstorage-test');

        var ls = document.createElement('iron-localstorage');
        ls.addEventListener('iron-localstorage-load-empty', function() {
          // testing recommended way to initialize localstorage
          ls.value = "Yo";
          ls.flushDebouncer('save');
          assert.equal("Yo", JSON.parse( window.localStorage.getItem('iron-localstorage-test')));
          done();
        });
        ls.name = 'iron-localstorage-test';
      });

      test('auto-save sub-properties', function() {
        var t = document.querySelector('#boundTemplate');
        var ls = document.querySelector('#boundLocal');
        var value = { foo: 'FOO', bar: 'BAR' };
        t.value = value;
        assert.equal('FOO', ls.value.foo); // value has propagated from template to storage

        ls.flushDebouncer('save');
        t.value.foo = "Yo";
        ls.flushDebouncer('save');
        var item = JSON.parse( window.localStorage.getItem('iron-localstorage-test'));
        assert.notEqual('Yo', item.foo); // did not propagate because did not use setters

        t.set('value.foo', 'BAZ!');
        ls.flushDebouncer('save');
        var item = JSON.parse( window.localStorage.getItem('iron-localstorage-test'));
        assert.equal('BAZ!', item.foo); // did propagate
        ls.value = null;
      });

    });