if (window.caches) {
        var swc = document.querySelector('platinum-sw-cache');

        suite('Precaching', function() {
          test('precache results in Cache Storage API entries', function() {
            return navigator.serviceWorker.ready.then(function() {
              return window.fetch(swc.cacheConfigFile).then(function(response) {
                return response.json();
              }).then(function(config) {
                return swc.precache.concat(config.precache);
              }).then(function(files) {
                return Promise.all(files.map(function(file) {
                  var url = new URL(file, window.location.href);
                  return window.caches.match(url).then(function(cachedResponse) {
                    assert.ok(cachedResponse, 'No match in Cache Storage API for ' + url);
                  });
                }));
              });
            });
          });
        });
      };