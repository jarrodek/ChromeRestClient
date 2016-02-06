Polymer({

    is: 'simple-element',

    behaviors: [
      Polymer.IronFormElementBehavior
    ],

    properties: {
      invalid: {
        type: Boolean,
        value: false
      },

      value: {
        type: String
      }
    },

    validate: function() {
      var valid = this.value ? this.value != '' : false;
      this.invalid = !valid;
      return valid;
    }

  });