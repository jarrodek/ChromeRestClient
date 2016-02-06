HTMLImports.whenReady(function() {
      Polymer({
        is: 'x-collapse',
        properties: {
          items: {
            type: Array
          }
        },

        _collapseExpand: function(e) {
          var list = this.$.list;
          var index = e.model.index;
          var isExpanded = list.items[index].expanded;

          list.set('items.' + index + '.expanded', !isExpanded);
          list.updateSizeForItem(e.model.index);
        },

        iconForItem: function(item) {
          return item ? (item.integer < 50 ? 'star-border' : 'star') : '';
        },

        getClassForItem: function(item, expanded) {
          return expanded ? 'item expanded' : 'item';
        }
      });
    });