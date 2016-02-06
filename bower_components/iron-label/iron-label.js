Polymer.IronLabel = Polymer({
      is: 'iron-label',

      listeners: {
        'tap': '_tapHandler'
      },

      properties: {
        /**
          * An ID reference to another element that needs to be
          * labelled by this `iron-label` element.
          */
        for: {
          type: String,
          value: '',
          reflectToAttribute: true,
          observer: '_forChanged'
        },
        _forElement: Object
      },

      attached: function() {
        this._forChanged();
      },

      ready: function() {
        this._generateLabelId();
      },

      // generate a unique id for this element
      _generateLabelId: function() {
        if (!this.id) {
          var id = 'iron-label-' + Polymer.IronLabel._labelNumber++;
          Polymer.dom(this).setAttribute('id', id);
        }
      },

      _findTarget: function() {
        if (this.for) {
          // external target
          var scope = Polymer.dom(this).getOwnerRoot();
          return Polymer.dom(scope).querySelector('#' + this.for);
        } else {
          // explicit internal target
          var el = Polymer.dom(this).querySelector('[iron-label-target]');
          if (!el) {
            // implicit internal target
            el = Polymer.dom(this).firstElementChild;
          }
          return el;
        }
      },

      _tapHandler: function(ev) {
        if (!this._forElement) {
          return;
        }
        var target = Polymer.dom(ev).localTarget;
        if (target === this._forElement) {
          return;
        }
        this._forElement.focus();
        this._forElement.click();
      },

      _applyLabelledBy: function() {
        if (this._forElement) {
          Polymer.dom(this._forElement).setAttribute('aria-labelledby', this.id);
        }
      },

      _forChanged: function() {
        if (this._forElement) {
          Polymer.dom(this._forElement).removeAttribute('aria-labelledby');
        }
        this._forElement = this._findTarget();
        this._applyLabelledBy();
      }
    });

    // global counter for unique label ids
    Polymer.IronLabel._labelNumber = 0;