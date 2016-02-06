Polymer({
      is: 'paper-badge',

      hostAttributes: {
        tabindex: '0',
        role: 'status'
      },

      behaviors: [
        Polymer.IronResizableBehavior
      ],

      listeners: {
        'iron-resize': 'updatePosition'
      },

      properties: {
        /**
         * The id of the element that the badge is anchored to. This element
         * must be a sibling of the badge.
         */
        for: {
          type: String,
          observer: '_forChanged'
        },

        /**
         * The label displayed in the badge. The label is centered, and ideally
         * should have very few characters.
         */
        label: {
          type: String,
          observer: '_labelChanged'
        },

        /**
         * An iron-icon ID. When given, the badge content will use an
         * `<iron-icon>` element displaying the given icon ID rather than the
         * label text. However, the label text will still be used for
         * accessibility purposes.
         */
        icon: {
          type: String,
          value: ''
        }
      },

      attached: function() {
        this._updateTarget();
      },

      _forChanged: function() {
        // The first time the property is set is before the badge is attached,
        // which means we're not ready to position it yet.
        if (!this.isAttached) {
          return;
        }
        this._updateTarget();
      },

      _labelChanged: function() {
        this.setAttribute('aria-label', this.label);
      },

      _updateTarget: function() {
        this._target = this.target;
        this.async(this.notifyResize, 1);
      },

      _computeIsIconBadge: function(icon) {
        return icon.length > 0;
      },

      /**
       * Returns the target element that this badge is anchored to. It is
       * either the element given by the `for` attribute, or the immediate parent
       * of the badge.
       */
      get target () {
        var parentNode = Polymer.dom(this).parentNode;
        // If the parentNode is a document fragment, then we need to use the host.
        var ownerRoot = Polymer.dom(this).getOwnerRoot();
        var target;

        if (this.for) {
          target = Polymer.dom(ownerRoot).querySelector('#' + this.for);
        } else {
          target = parentNode.nodeType == Node.DOCUMENT_FRAGMENT_NODE ?
              ownerRoot.host : parentNode;
        }

        return target;
      },

      /**
       * Repositions the badge relative to its anchor element. This is called
       * automatically when the badge is attached or an `iron-resize` event is
       * fired (for exmaple if the window has resized, or your target is a
       * custom element that implements IronResizableBehavior).
       *
       * You should call this in all other cases when the achor's position
       * might have changed (for example, if it's visibility has changed, or
       * you've manually done a page re-layout).
       */
      updatePosition: function() {
        if (!this._target)
          return;

        if (!this.offsetParent)
          return;

        var parentRect = this.offsetParent.getBoundingClientRect();
        var targetRect = this._target.getBoundingClientRect();
        var thisRect = this.getBoundingClientRect();

        this.style.left = targetRect.left - parentRect.left +
            (targetRect.width - thisRect.width / 2) + 'px';
        this.style.top = targetRect.top - parentRect.top -
            (thisRect.height / 2) + 'px';
      }
    });