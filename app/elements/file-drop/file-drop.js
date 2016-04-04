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
    _dragging: {
      type: Boolean,
      value: false
    },
    _dropSectionClass: {
      type: String,
      computed: '_computeDropSectionClassName(_dragging)'
    },
    file: {
      type: Object,
      value: null
    },
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
  selectFile: function() {
    Polymer.dom(this.root).querySelector('#file').click();
  },
  _onDragEnter: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._dragging = true;
  },
  _onDragLeave: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._dragging = false;
  },
  _onDragOver: function(e) {
    e.stopPropagation();
    e.preventDefault();
    this._dragging = true;
  },
  _onDrop: function(e) {
    this._dragging = false;
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
  _manualSelected: function() {
    var input = Polymer.dom(this.root).querySelector('#file');
    if (input.files.length) {
      this._processFile(input.files[0]);
    }
  },
  _processFile: function(file) {
    this.file = file;
    this.fire('file-ready', {
      file: file
    });
    // this.playAnimation('entry');
  },

  _computeDropSectionClassName: function(dragging) {
    var cls = 'drop-zone layout vertical center';
    if (dragging) {
      cls += ' active';
    }
    return cls;
  },

  _computeHasFile: function(file) {
    return !!file;
  },

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
