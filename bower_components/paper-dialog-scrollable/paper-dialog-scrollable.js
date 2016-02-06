(function() {

  Polymer({

    is: 'paper-dialog-scrollable',

    properties: {

      /**
       * The dialog element that implements `Polymer.PaperDialogBehavior` containing this element.
       * @type {?Node}
       */
      dialogElement: {
        type: Object,
        value: function() {
          return this.parentNode;
        }
      }

    },

    listeners: {
      'scrollable.scroll': '_onScroll',
      'iron-resize': '_onIronResize'
    },

    /**
     * Returns the scrolling element.
     */
    get scrollTarget() {
      return this.$.scrollable;
    },

    attached: function() {
      this.classList.add('no-padding');
      // Set itself to the overlay sizing target
      this.dialogElement.sizingTarget = this.scrollTarget;
      // If the host is sized, fit the scrollable area to the container. Otherwise let it be
      // its natural size.
      requestAnimationFrame(function() {
        if (this.offsetHeight > 0) {
          this.$.scrollable.classList.add('fit');
        }
        this._scroll();
      }.bind(this));
    },

    _scroll: function() {
      this.toggleClass('is-scrolled', this.scrollTarget.scrollTop > 0);
      this.toggleClass('can-scroll', this.scrollTarget.offsetHeight < this.scrollTarget.scrollHeight);
      this.toggleClass('scrolled-to-bottom',
        this.scrollTarget.scrollTop + this.scrollTarget.offsetHeight >= this.scrollTarget.scrollHeight);
    },

    _onScroll: function() {
      this._scroll();
    }

  })

})();