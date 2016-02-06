function toggle(selector) {
    document.querySelector(selector).toggle();
  }

  document.querySelector('template[is=dom-bind]').isExpanded = function(opened) {
    return String(opened);
  };