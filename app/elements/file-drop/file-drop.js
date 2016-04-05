(function() {
'use strict';

Polymer({
  is: 'file-drop',
  listeners: {
    'dragenter': '_onDragEnter',
    'dragleave': '_onDragLeave',
    'dragover': '_onDragOver',
    'drop': '_onDrop',
    'neon-animation-finish': '_onNeonAnimationFinish'
  },
  behaviors: [
    Polymer.NeonAnimationRunnerBehavior
  ],
  properties: {
    // True when file is dragged over the element.
    dragging: {
      type: Boolean,
      value: false,
      readOnly: true
    },
    // Computed css class name for drop section
    _dropSectionClass: {
      type: String,
      computed: '_computeDropSectionClassName(dragging)'
    },
    // A file object(s) dropped into the element.
    file: {
      type: Object,
      value: null
    },
    //True if the element received file(s).
    hasFile: {
      type: Boolean,
      value: false,
      computed: '_computeHasFile(file)'
    },
    animationConfig: {
      value: function() {
        return {
          'entry': {
            name: 'fade-out-animation',
            node: this.$.dropSection,
            timing: {
              duration: 700
            }
          },
          'exit': {
            name: 'fade-in-animation',
            node: this.$.dropSection,
            timing: {
              duration: 700
            }
          }
        };
      }
    }
  },
  // Open a file selector.
  selectFile: function() {
    Polymer.dom(this.root).querySelector('#file').click();
  },
  // Handler for dragenter event.
  _onDragEnter: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._setDragging(true);
  },

  _onDragLeave: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._setDragging(false);
  },
  _onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._setDragging(true);
  },
  // Handler for drop event.
  _onDrop: function(e) {
    this._setDragging(false);
    e.stopPropagation();
    e.preventDefault();
    var dt = e.dataTransfer;
    var files = dt.files;
    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      this._processFile(file);
      return;
    }
  },
  // A handler called when the user manually selected the file (not by drag and drop)
  _manualSelected: function() {
    var input = Polymer.dom(this.root).querySelector('#file');
    if (input.files.length) {
      this._processFile(input.files[0]);
    }
  },
  // Called when the element receive a file.
  _processFile: function(file) {
    this.file = file;
    this.fire('file-ready', {
      file: file
    });
    // this.playAnimation('entry');
  },
  // Computes class name for dragging section.
  _computeDropSectionClassName: function(dragging) {
    var cls = 'drop-zone layout vertical center';
    if (dragging) {
      cls += ' active';
    }
    return cls;
  },
  // Compute if the element received a file
  _computeHasFile: function(file) {
    return !!file;
  },
  // Resets the state of the element to the default view.
  reset: function() {
    this.file = null;
    var input = Polymer.dom(this.root).querySelector('#file');
    input.value = null;
    // this.cancelAnimation();
    // var section = Polymer.dom(this.root).querySelector('#dropSection');
    // if (section.classList.contains('with-file')) {
    //   section.classList.remove('with-file');
    // }
    // this.playAnimation('exit');
  },

  _onNeonAnimationFinish: function() {
    var section = Polymer.dom(this.root).querySelector('#dropSection');
    if (this.file) {
      if (!section.classList.contains('with-file')) {
        section.classList.add('with-file');
      }
      section.classList.remove('without-file');
    } else {
      if (section.classList.contains('with-file')) {
        section.classList.remove('with-file');
      }
      section.classList.add('without-file');
    }
  }
});
})();
