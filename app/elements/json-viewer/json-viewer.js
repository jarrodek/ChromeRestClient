'use strict';

Polymer({
  is: 'json-viewer',
  properties: {
    /**
     * JSON data to parse an display
     */
    json: {
      type: Object,
      observer: '_changed'
    },
    /**
     * True if error ocurred during parse method
     */
    isError: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * True when JSON is parsed
     */
    working: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * True when output should be shown.
     */
    showOutput: {
      type: Boolean,
      readOnly: true,
      value: false,
      computed: '_computeShowOutput(working, isError, json)'
    },
    _worker: Object,
    _workerDataHandler: {
      type: Function,
      value: function() {
        return this._workerData.bind(this);
      }
    },
    _workerErrorHandler: {
      type: Function,
      value: function() {
        return this._workerData.bind(this);
      }
    }
  },

  detatch: function() {
    if (!this._worker) {
      worker.removeEventListener('message', this._workerDataHandler);
      worker.removeEventListener('error', this._workerErrorHandler);
    }
  },

  _changed: function() {
    if (!this.json) {
      return;
    }
    this._setWorking(true);
    this._setIsError(false);
    this.$.output.innerText = '';

    if (!this._worker) {
      let worker = new Worker('/scripts/workers/jsonviewer.js');
      worker.addEventListener('message', this._workerDataHandler);
      worker.addEventListener('error', this._workerErrorHandler);
      this._worker = worker;
    }
    this._worker.postMessage(this.json);
  },

  _workerData: function(e) {
    var data = e.data;
    this._setWorking(false);
    if (data.error) {
      this._setIsError(true);
      this.$.output.innerHTML = data.message;
    } else {
      this.$.output.innerHTML = data.message;
    }
  },

  _workerError: function(e) {
    this._setIsError(true);
    this._setWorking(false);
  },

  _computeShowOutput: function(working, isError, json) {
    return !working && !isError && !!json;
  },

  _handleDisplayClick: function(e) {
    if (!e.target) {
      return;
    }

    if (e.target.nodeName == 'A') {
      e.preventDefault();
      this.fire('action-link-change', {
        url: e.target.getAttribute('href')
      });
      window.scrollTo(0, 0);
      return;
    }
    var toggleId = e.target.dataset.toggle;
    if (!toggleId) {
      return;
    }
    var parent = Polymer.dom(this.root).querySelector('div[data-element="' + toggleId + '"]');
    if (!parent) {
      return;
    }
    var expanded = parent.dataset.expanded;
    if (!expanded || expanded == 'true') {
      parent.dataset.expanded = 'false';
    } else {
      parent.dataset.expanded = 'true';
    }
  }
});
