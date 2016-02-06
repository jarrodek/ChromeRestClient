// kick off delayed loader by setting libraryUrl
      window.setTimeout(function() {
        var t = document.querySelector('#delayedLoader');
        t.libraryUrl = 'https://apis.google.com/js/drive-realtime.js?onload=%%callback%%';
      },
      1000);