document.querySelector('template[is=dom-bind]').iconForItem = function(item) {
      return item ? (item.integer < 50 ? 'star-border' : 'star') : '';
    };

    document.addEventListener('paper-header-transform', function(event) {
      var title = this.querySelector('.title');
      var detail = event.detail;
      var deltaHeight = detail.height - detail.condensedHeight;
      var scale = Math.max(0.6, (deltaHeight - detail.y) / (deltaHeight / 0.4)  + 0.6);

      Polymer.Base.transform('scale(' + scale + ') translateZ(0)', title);
    });