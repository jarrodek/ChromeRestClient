(function() {
'use strict';

Polymer({
  is: 'json-viewer',
  /**
   * Event called when the user click on the anchor in display area.
   *
   * @event action-link-change
   */
  properties: {
    /**
     * JSON data to parse and display
     */
    json: {
      type: String,
      observer: '_changed'
    },
    /**
     * True if error ocurred when parsing `json` data
     */
    isError: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    /**
     * True when JSON is beeing parsed
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
    // A reference to the worker object.
    _worker: Object,
    // function to be called when worker data are received
    _workerDataHandler: {
      type: Function,
      value: function() {
        return this._workerData.bind(this);
      }
    },
    // function to be called when worker error data are received
    _workerErrorHandler: {
      type: Function,
      value: function() {
        return this._workerError.bind(this);
      }
    },

    // An element which should be searched for text.
    _textSearch: {
      type: HTMLElement,
      value: function() {
        return this.$.output;
      }
    },
    raw: String,
    // Performance check helper.
    _parserMarkCount: {
      type: Number,
      value: 0
    }
  },

  behaviors: [
    ArcBehaviors.TextSearchBehavior
  ],

  detatch: function() {
    if (!this._worker) {
      this.worker.removeEventListener('message', this._workerDataHandler);
      this.worker.removeEventListener('error', this._workerErrorHandler);
    }
  },
  // Called when `json` property changed. It starts parsing the data.
  _changed: function() {

    this._setIsError(false);
    this.$.output.innerText = '';
    var json = this.json;
    if (json === undefined) {
      return;
    }

    if (json === null) {
      let html = '<div class="prettyPrint"><span class="nullValue">null';
      html += '</span></div>';
      this.$.output.innerHTML = html;
      this.$.output.removeAttribute('hidden');
      return;
    }

    if (json === false) {
      let html = '<div class="prettyPrint"><span class="booleanValue">false';
      html += '</span></div>';
      this.$.output.innerHTML = html;
      this._setShowOutput(true);
      return;
    }
    window.performance.mark('mark_start_json_parser_worker');

    this._setWorking(true);
    if (!this._worker) {
      let worker = new Worker('/scripts/workers/jsonviewer.js');
      worker.addEventListener('message', this._workerDataHandler);
      worker.addEventListener('error', this._workerErrorHandler);
      this._worker = worker;
    }

    this._worker.postMessage({
      json: json,
      raw: this.raw
    });
  },
  // Called when worker data received.
  _workerData: function(e) {
    var data = e.data;
    this._setWorking(false);
    if (data.error) {
      this._setIsError(true);
      this.$.output.innerHTML = data.message;
    } else {
      this.$.output.innerHTML = data.message;
    }
    window.performance.mark('mark_end_json_parser_worker');
    this._parserMarkCount++;
    window.performance.measure('measure_json_parser_' + this._parserMarkCount,
      'mark_start_json_parser_worker', 'mark_end_json_parser_worker');
  },
  // Called when workr error received.
  _workerError: function() {
    this._setIsError(true);
    this._setWorking(false);
  },
  // Compute if output should be shown.
  _computeShowOutput: function(working, isError, json) {
    return !working && !isError && (!!json && json !== null && json !== false);
  },
  // Called when the user click on the display area. It will handle view toggle and links clicks.
  _handleDisplayClick: function(e) {
    if (!e.target) {
      return;
    }

    if (e.target.nodeName === 'A') {
      e.preventDefault();
      this.fire('action-link-change', {
        url: e.target.getAttribute('href')
      });
      /* global app */
      //TODO: this should be done by events, not direct use of global function.
      app.scrollPageToTop();
      this.fire('send-analytics', {
        type: 'event',
        category: 'Response status',
        action: 'Link change',
        label: 'From JSON viewer'
      });
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
    if (!expanded || expanded === 'true') {
      parent.dataset.expanded = 'false';
    } else {
      parent.dataset.expanded = 'true';
    }
  }
});
})();
