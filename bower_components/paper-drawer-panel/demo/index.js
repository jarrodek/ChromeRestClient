(function(global) {

        'use strict';

        var DRAWER_ATTR = 'right-drawer';

        var pdp = document.getElementById('paperDrawerPanel');

        global.flipDrawer = function() {
          if (pdp.hasAttribute(DRAWER_ATTR)) {
            pdp.removeAttribute(DRAWER_ATTR);
          } else {
            pdp.setAttribute(DRAWER_ATTR, '');
          }
        }

      }(this));