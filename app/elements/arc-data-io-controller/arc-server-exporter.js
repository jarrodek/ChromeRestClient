Polymer({
  is: 'arc-server-exporter',
  properties: {
    /** set by controller. true if there was an error connecting to the server */
    serverError: {
      type: Boolean,
      value: false
    },
    /** true if can show entire section */
    show: {
      type: Boolean,
      readOnly: true,
      computed: '_canShow(serverError)'
    },
    /**
     * Will have `state` nad `uid` keys.
     * This is set by controller.
     */
    session: Object,
    /** True if connect button can be shown */
    showConnect: {
      type: Boolean,
      readOnly: true,
      value: false,
      computed: '_canShowConnect(authorized)'
    },
    /** True if import/export options should be visible */
    showActions: {
      type: Boolean,
      readOnly: true,
      value: false,
      computed: '_canShowActions(authorized)'
    },
    /** True when loader should be shown. */
    loading: {
      type: Boolean,
      readOnly: true,
      value: false
    },
    authorized: {
      type: Boolean,
      value: false
    }
  },
  /** Compute if whole section can be shown. */
  _canShow: function() {
    return !this.serverError;
  },
  /** Compute if can show connect to the server button */
  _canShowConnect: function(state) {
    return state < 1;
  },
  /** Compute if can show import / export actions */
  _canShowActions: function(authorized) {
    return authorized;
  },
  /** Connect with the server */
  connect: function() {
    this.fire('connect');
  }
});
