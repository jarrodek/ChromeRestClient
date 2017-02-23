Polymer({
  is: 'dom-reorderer',
  /**
   *
   *
   * @event dom-order-changed
   * @param {Object} item An item that has been moved
   * @param {Number} from Original index position of the moved item
   * @param {Number} to New position of the moved item.
   */
  properties: {
    // Dragged element start top position relative to the parent element.
    startScrollTop: Number,
    // The element currently being dragged.
    dragElement: HTMLElement,
    // Model for dragged element.
    dragModel: Object,
    // Index of the item being under the dragged item.
    overIndex: Number,
    // Model of the element being under the dragged item.
    overModel: Object
  },

  listeners: {
    scroll: 'handleScroll',
    'dom-change': '_trackElements'
  },

  handleScroll: function() {
    if (this.dragElement) {
      this.updateDragPosition();
    }
  },

  _trackElements: function(e) {
    if (!this.repeater && e.target.is === 'dom-repeat') {
      this.repeater = e.target;
    }
    if (e.target === this.repeater) {
      Polymer.dom(this).children.forEach(function(el) {
        if (el !== this.repeater && !el.__reorderTracking) {
          this.listen(el, 'track', '_handleTrack');
          el.__reorderTracking = true;
        }
      }, this);
    }
  },

  _handleTrack: function(e) {
    switch (e.detail.state) {
      case 'start':
        this._onTrackStart(e);
        break;
      case 'track':
        this._onTrack(e);
        break;
      case 'end':
        this._onTrackEnd(e);
        break;
    }
  },

  /**
   * A handler for track stat event.
   * Captures the initial state to be used in other handlers.
   *
   * @param {Event} e The track event
   */
  _onTrackStart: function(e) {
    // Capture initial state
    this.startScrollTop = this.scrollTop;
    this.dragElement = this._getReorderedItem(e);
    this.dragElement.style.pointerEvents = 'none';
    this.dragElement.classList.add('dragging');
    this.dragModel = this.repeater.modelForElement(this.dragElement);
  },
  /**
   * Updates the position of dragging element and other elements being under dragged element.
   *
   * @param {Event} e The track event
   */
  _onTrack: function(e) {
    // Re-position dragged item
    this.updateDragPosition(e.detail.dy);
    // Translate non-dragged items up/down
    var overEl = e.detail.hover();
    var overModel = overEl && this.repeater.modelForElement(overEl);
    if (overModel) {
      this.overModel = overModel;
      this.dirOffset = e.detail.ddy < 0 ? -1 : 0;
      var lastOverIndex = this.overIndex || 0;
      var overIndex = overModel.index + this.dirOffset;
      var start = Math.max(overIndex < lastOverIndex ? overIndex : lastOverIndex, 0);
      var end = overModel.index < lastOverIndex ? lastOverIndex : overModel.index;
      var children = Polymer.dom(this).children;
      for (var i = start; i <= end; i++) {
        var el = children[i];
        if (el !== this.repeater && i !== this.dragModel.index) {
          var dir = 0;
          if (i > this.dragModel.index && i <= overIndex) {
            dir = -1;
          } else if (i > overIndex && i < this.dragModel.index) {
            dir = 1;
          }
          el.classList.add('moving');
          this.translate3d(0, dir * this.dragElement.offsetHeight + 'px', 0, el);
        }
      }
      this.overIndex = overModel.index;
    }
  },

  /**
   * Saves current state and update list order.
   */
  _onTrackEnd: function() {
    var movedItem = this.dragModel.item;
    var toIdx;
    // Move item in array to new position
    var fromIdx = this.repeater.items.indexOf(movedItem);
    if (fromIdx >= 0 && this.overModel) {
      toIdx = this.repeater.items.indexOf(this.overModel.item) +
        (this.overModel.index > this.dragModel.index ? this.dirOffset : 0);
      let item = this.repeater.splice('items', fromIdx, 1)[0];
      this.repeater.splice('items', toIdx, 0, item);
    }
    // Reset style of dragged & moved elements
    this.dragElement.style.pointerEvents = '';
    this.dragElement.classList.remove('dragging');
    this.dragElement = undefined;
    Polymer.dom(this).children.forEach((el) => {
      this.transform('', el);
      el.classList.remove('moving');
    });
    if (toIdx || toIdx === 0) {
      this.fire('dom-order-changed', {
        item: movedItem,
        from: fromIdx,
        to: toIdx
      });
    }
  },

  /**
   * Gets the top level item from the DOM repeater that has been marked as a draggable item.
   * The event can originate from child elements which shouldn't be dragged.
   *
   * @param {Event} e The track event
   * @return {HTMLElement} An element that is container for draggable items. Undefined if couldn't
   * find.
   */
  _getReorderedItem: function(e) {
    var path = e.path;
    if (!path || !path.length) {
      return;
    }
    for (let i = 0, len = path.length; i < len; i++) {
      if (path[i].__reorderTracking) {
        return path[i];
      }
    }
  },

  updateDragPosition: function(dy) {
    this.trackDelta = dy || this.trackDelta || 0;
    var scrollDelta = this.scrollTop - this.startScrollTop;
    var pos = this.trackDelta + scrollDelta;
    this.translate3d(0, pos + 'px', 0, this.dragElement);
  }
});
