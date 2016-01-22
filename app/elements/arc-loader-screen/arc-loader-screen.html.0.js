'use strict';

Polymer({

  is: 'arc-loader-screen',

  listeners: {
    'neon-animation-finish': '_onNeonAnimationFinish'
  },

  behaviors: [
    Polymer.NeonAnimationRunnerBehavior
  ],

  properties: {
    opened: {
      type: Boolean,
      value: true,
      observer: '_openedChanged'
    },

    animationConfig: {
      value: function() {
        return {
          'entry': {
            name: 'fade-in-animation',
            node: this
          },
          'exit': [{
            name: 'slide-loader-down-animation',
            node: this.$.container
          }, {
            name: 'fade-out-animation',
            node: this.$.container
          }, {
            name: 'fade-out-animation',
            node: this,
            timing: {
              delay: 150
            }
          }]
        };
      }
    }
  },

  _openedChanged: function() {
    //console.log('Opened changed: ', this.opened);
    if (this.opened) {
      this.style.display = 'inherit';
      this.playAnimation('entry');
    } else {
      this.playAnimation('exit');
    }
  },
  /**
   * Open the loader screen.
   */
  open: function() {
    this.opened = true;
  },
  /**
   * Close the loader screen
   */
  close: function() {
    this.opened = false;
  },

  _onNeonAnimationFinish: function() {
    if (!this.opened) {
      this.style.display = 'none';
    }
  }
});
