function findElementInList(container, selector) {
    var i = 0;
    var children = container._children;
    var ms = Polymer.DomApi.matchesSelector;

    for (; i < children.length; i++) {
      if (children[i].nodeType === Node.ELEMENT_NODE && ms.call(children[i], selector)) {
        return children[i];
      }
    }
    return null;
  }

  function buildItem(index) {
    return {
      index: index
    };
  }

  function buildDataSet(size) {
    var data = [];
    while (data.length < size) {
      data.push(buildItem(data.length));
    }
    return data;
  }

  function simulateScroll(config, fn) {
    var list = config.list;
    var target = config.target;
    var delay = config.delay || 1;
    var contribution = config.contribution || 10;

    function scroll(dir, prevVal) {
      if ((dir > 0 && list.scrollTop >= target) || 
          (dir < 0 && list.scrollTop <= target) || 
          list.scrollTop === prevVal
        ){
        list.scrollTop = target;
        setTimeout(fn.bind(null, list.scrollTop), 100);
        return;
      }
      prevVal = list.scrollTop;
      list.scrollTop = list.scrollTop + dir;
      setTimeout(scroll.bind(null, dir, prevVal), delay);
    }

    if (list.scrollTop < target) {
      scroll(Math.abs(contribution), -1);
    } else if (list.scrollTop > target) {
      scroll(-Math.abs(contribution), -1);
    }
  }

  function getFirstItemFromList(list) {
    var listRect = list.getBoundingClientRect();
    return document.elementFromPoint(listRect.left + 1, listRect.top + 1);
  }

  function getLastItemFromList(list) {
    var listRect = list.getBoundingClientRect();
    return document.elementFromPoint(listRect.left + 1, listRect.top + listRect.height - 1);
  }

  function isFullOfItems(list) {
    var listRect = list.getBoundingClientRect();
    var listHeight = listRect.height - 1;
    var item, y = listRect.top + 1;
    // IE 10 & 11 doesn't render propertly :(
    var badPixels = 0;
    while (y < listHeight) {
      item = document.elementFromPoint(listRect.left + 100, y);
      if (item.parentNode && !item.parentNode._templateInstance) {
        badPixels++;
      }
      if (badPixels > 3) {
        return false;
      }
      y += 2;
    }
    return true;
  };