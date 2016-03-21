(function() {
'use strict';

Polymer({

  is: 'slide-loader-down-animation',

  behaviors: [
    Polymer.NeonAnimationBehavior
  ],

  configure: function(config) {
    var node = config.node;

    if (config.transformOrigin) {
      this.setPrefixedProperty(node, 'transformOrigin', config.transformOrigin);
    } else {
      this.setPrefixedProperty(node, 'transformOrigin', '50% 0');
    }

    this._effect = new KeyframeEffect(node, [{
      'transform': 'none'
    }, {
      'transform': 'translateY(100%)'
    }], this.timingFromConfig(config));

    return this._effect;
  }
});
})();
