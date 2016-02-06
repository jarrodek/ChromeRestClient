Polymer({
    is: 'x-key-aware',

    properties: {
      pressed: {
        type: String,
        readOnly: true,
        value: ''
      },

      boundKeys: {
        type: Array
      },

      target: {
        type: Object,
        value: function() {
          return document.body;
        }
      }
    },

    ready: function() {
      this.boundKeys = this.$.keys.keys.split(' ');
    },

    _updatePressed: function(event) {
      console.log(event.detail);

      this._setPressed(
        this.pressed + event.detail.combo + ' pressed!\n'
      );
    }
  });