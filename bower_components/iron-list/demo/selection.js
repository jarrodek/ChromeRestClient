HTMLImports.whenReady(function() {

      Polymer({

        is: 'x-app',

        properties: {
          selectedItems: {
            type: Object
          },

          showSelection: {
            type: Boolean,
            value: true,
            observer: '_showSelectionChanged'
          }
        },

        iconForItem: function(isSelected) {
          return isSelected ? 'star' : 'star-border';
        },

        _computedClass: function(isSelected) {
          var classes = 'item';
          if (isSelected) {
            classes += ' selected';
          }
          return classes;
        },

        _unselect: function(e) {
          this.$.itemsList.deselectItem(e.model.item);
        },

        _toggleStarredView: function() {
          this.showSelection = !this.showSelection;
        },

        _showSelectionChanged: function() {
          this.$.selectedItemsList.fire('resize');
        },

        _getAriaLabel: function(item, selected) {
          return selected ? 'Deselect ' + item.name : 'Select ' + item.name;
        }
      });

   });