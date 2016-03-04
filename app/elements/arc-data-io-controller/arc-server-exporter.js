Polymer({
  is: 'arc-server-exporter',
  properties: {
    /** set by controller. true if there was an error connecting to the server */
    serverError: {
      type: Boolean,
      value: false
    },
    /** true if can show man section */
    show: {
      type: Boolean,
      readOnly: true,
      computed: '_computeShowMain(serverError, isAuthorized)'
    },
    /** True when loader should be shown. */
    loading: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    isAuthorized: Boolean
  },
  /** Compute if whole section can be shown. */
  _computeShowMain: function(serverError, isAuthorized) {
    return !serverError && isAuthorized;
  }
});
