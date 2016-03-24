(function() {
'use strict';

Polymer({
  is: 'xml-viewer',
  properties: {
    /**
     * XML data to parse an display
     */
    xml: {
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
     * True when XML is parsing
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
      computed: '_computeShowOutput(working, isError, xml)'
    },
    /**
     * An error message to display.
     */
    errorMessage: {
      type: String,
      readOnly: true
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
        return this._workerError.bind(this);
      }
    }
  },

  detatch: function() {
    if (!this._worker) {
      this.worker.removeEventListener('message', this._workerDataHandler);
      this.worker.removeEventListener('error', this._workerErrorHandler);
    }
  },

  _changed: function() {
    if (!this.xml) {
      return;
    }
    this._setWorking(true);
    this._setIsError(false);
    this._setErrorMessage(null);
    this.$.output.innerText = '';

    if (!this._worker) {
      let worker = new Worker('/scripts/workers/xmlviewer.js');
      worker.addEventListener('message', this._workerDataHandler);
      worker.addEventListener('error', this._workerErrorHandler);
      this._worker = worker;
    }
    this._worker.postMessage(this.xml);
  },

  _workerData: function(e) {
    this._setWorking(false);
    this.$.output.innerHTML = e.data;
  },

  _workerError: function(e) {
    this._setIsError(true);
    this._setWorking(false);
    var err = e.message.replace('Uncaught Error: ', '');
    if (err) {
      this._setErrorMessage(err);
    }
  },

  _computeShowOutput: function(working, isError, xml) {
    return !working && !isError && !!xml;
  },

  _handleDisplayClick: function(e) {
    if (!e.target) {
      return;
    }
    var target = e.target;
    if (!target.getAttribute('colapse-marker')) {
      target = target.parentNode;
      if (!target || !target.getAttribute('colapse-marker')) {
        return;
      }
    }
    target = target.parentNode;
    var expanded = target.dataset.expanded;
    if (!expanded || expanded === 'true') {
      target.dataset.expanded = 'false';
    } else {
      target.dataset.expanded = 'true';
    }
  }
});
})();
