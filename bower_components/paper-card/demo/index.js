function decreaseShadow() {
      var card = document.querySelector('#shadow_demo');
      card.elevation = card.elevation > 0 ? card.elevation - 1 : 0;
    }

    function increaseShadow() {
      var card = document.querySelector('#shadow_demo');
      card.elevation = card.elevation < 5 ? card.elevation + 1 : 5;
    }

    var expandDemo = document.getElementById('expand-demo');

    expandDemo._toggleMoreInfo = function(event) {
      var moreInfo = document.getElementById('more-info');
      var iconButton = Polymer.dom(event).localTarget;
      iconButton.icon = moreInfo.opened ? 'hardware:keyboard-arrow-up'
                                        : 'hardware:keyboard-arrow-down';
      moreInfo.toggle();
    };