// toggle fixed header based on screen size
    var panel = document.querySelector('paper-scroll-header-panel');
    var mquery = document.querySelector('#mquery');

    mquery.addEventListener('query-matches-changed', function() {
      panel.fixed = mquery.queryMatches;
    });

    panel.fixed = mquery.queryMatches;

    // custom transformation: scale header's title
    var title = document.querySelector('.title');
    addEventListener('paper-header-transform', function(e) {
      var d = e.detail;
      var m = d.height - d.condensedHeight;
      var scale = Math.max(0.75, (m - d.y) / (m / 0.25)  + 0.75);

      Polymer.Base.transform('scale(' + scale + ') translateZ(0)', title);
    });