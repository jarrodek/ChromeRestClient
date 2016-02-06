var app = document.querySelector('#app');

    document.querySelector('template[is=dom-bind]').iconForItem = function(item) {
      return item ? (item.integer < 50 ? 'star-border' : 'star') : '';
    };

    // Custom transformation: scale header's title
    addEventListener('paper-header-transform', function(e) {
      var title = document.querySelector('.title');
      var middleContainer = document.querySelector('.middle-container');
      var bottomContainer = document.querySelector('.bottom-container');
      var detail = e.detail;
      var heightDiff = detail.height - detail.condensedHeight;
      var yRatio = Math.min(1, detail.y / heightDiff);
      var maxMiddleScale = 0.50;  // title max size when condensed. The smaller the number the smaller the condensed size.
      var scaleMiddle = Math.max(maxMiddleScale, (heightDiff - detail.y) / (heightDiff / (1-maxMiddleScale))  + maxMiddleScale);
      var scaleBottom = 1 - yRatio;

      // Move/translate middleContainer
      Polymer.Base.transform('translate3d(0,' + yRatio * 100 + '%,0)', middleContainer);

      // Scale bottomContainer and bottom title to 0 and back
      Polymer.Base.transform('scale(' + scaleBottom + ') translateZ(0)', bottomContainer);

      // Scale middle Title
      Polymer.Base.transform('scale(' + scaleMiddle + ') translateZ(0)', title);
    });

    // Refresh Data
    app.refreshData = function() {
      this.$.get_filltext_ajax.generateRequest();
    };