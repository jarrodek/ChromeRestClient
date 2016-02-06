window.arc.app.analytics.init();

window.Polymer = window.Polymer || {};
window.Polymer.dom = 'shadow';

window.addEventListener('load', function() {
  window.arc.app.arc.checkCompatybility();
});

//Initialize libs:
//libs must be initialized in zzz.init.js file so the background page will initialize them as well.
