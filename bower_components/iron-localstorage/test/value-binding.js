window.localStorage.setItem('iron-localstorage-test', '{"foo":"bar"}');
    var xtest;

    suite('basic', function() {

      suiteSetup(function() {
        Polymer({
          is: 'x-foo',
          properties: {
            'value': {
              type: Object,
              notify: true
            }
          }
        });
        Polymer({
          is: 'x-test',
          properties: {
            'value': {
              type: Object,
              notify: true
            }
          }
        });
        window.localStorage.setItem('iron-localstorage-test', '{"foo":"bar"}');
        xtest = document.querySelector('x-test');
        xtest.$.localstorage.reload();
      });

      suiteTeardown(function() {
        window.localStorage.removeItem('iron-localstorage-test');
      });

      test('initial value', function() {
        assert.isNotNull(xtest.value);
        assert.equal(xtest.value.foo, 'bar');
      });

      test('set value', function() {
        var newValue = {'foo': 'zot'};
        xtest.value = newValue;
        xtest.$.localstorage.flushDebouncer('save');
        var v = window.localStorage.getItem(xtest.$.localstorage.name);
        v = JSON.parse(v);
        assert.equal(v.foo, newValue.foo);
      });

      test('save', function() {
        xtest.value.foo = 'quux';
        xtest.$.localstorage.save();
        var v = window.localStorage.getItem(xtest.$.localstorage.name);
        v = JSON.parse(v);
        assert.equal(v.foo, 'quux');
      });

    });