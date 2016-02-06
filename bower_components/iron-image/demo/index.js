window.addEventListener('WebComponentsReady', function() {
          Polymer({
            is: 'demo-page',

            preload: function(e) {
              var img = document.querySelector('#' + e.target.getAttribute('target'));
              img.src = './polymer.svg?' + Math.random();
              e.target.textContent = 'Reload image';
            },

            _computeLogoAltText: function(loading, loaded) {
              var text = 'The Polymer logo. ';

              if (loading) {
                text += '(loading)';
              } else if (loaded) {
                text += '(loaded)';
              } else {
                text += '(not loaded)';
              }

              return text;
            }
          });
        });