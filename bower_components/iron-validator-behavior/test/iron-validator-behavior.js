suite('basic', function() {

      test('registered in <iron-meta>', function() {
        fixture('basic');
        assert.ok(new Polymer.IronMeta({type: 'validator'}).byKey('simple-validator'), 'simple-validator found in <iron-meta>');
      });

    });