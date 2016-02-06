Polymer({
      is: 'paper-radio-button',

      behaviors: [
        Polymer.PaperCheckedElementBehavior
      ],

      hostAttributes: {
        role: 'radio',
        'aria-checked': false,
        tabindex: 0
      },

      properties: {
        /**
         * Fired when the checked state changes due to user interaction.
         *
         * @event change
         */

        /**
         * Fired when the checked state changes.
         *
         * @event iron-change
         */

        ariaActiveAttribute: {
          type: String,
          value: 'aria-checked'
        }
      },

      // create the element ripple inside the `radioContainer`
      _createRipple: function() {
        this._rippleContainer = this.$.radioContainer;
        return Polymer.PaperInkyFocusBehaviorImpl._createRipple.call(this);
      }
    });