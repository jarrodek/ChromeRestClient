/**
   * Use `Polymer.IronValidatorBehavior` to implement a custom input/form validator. Element
   * instances implementing this behavior will be registered for use in elements that implement
   * `Polymer.IronValidatableBehavior`.
   * 
   * @demo demo/index.html
   * @polymerBehavior
   */
  Polymer.IronValidatorBehavior = {

    properties: {

      /**
       * Namespace for this validator.
       */
      validatorType: {
        type: String,
        value: 'validator'
      },

      /**
       * Name for this validator, used by `Polymer.IronValidatableBehavior` to lookup this element.
       */
      validatorName: {
        type: String,
        value: function() {
          return this.is;
        }
      }

    },

    ready: function() {
      new Polymer.IronMeta({type: this.validatorType, key: this.validatorName, value: this});
    },

    /**
     * Implement custom validation logic in this function.
     * @param {Object} values The value to validate. May be any type depending on the validation logic.
     * @return {Boolean} true if `values` is valid.
     */
    validate: function(values) {
    }
  };