Polymer({
  is: 'arc-request-error-view',
  properties: {
    // Message to display.
    message: {
      type: String,
      observer: '_messageChanged'
    },
    detailsPage: Number
  },
  // handler to the message change event.
  _messageChanged: function(msg) {
    // msg = 'NET::ERR_CERT_COMMON_NAME_INVALID';
    switch (msg) {
      case 'net::ERR_CERT_AUTHORITY_INVALID':
        this.detailsPage = 1;
        break;
      case 'net::ERR_CONNECTION_REFUSED':
        this.detailsPage = 2;
        break;
      case 'NET::ERR_CERT_COMMON_NAME_INVALID':
        this.detailsPage = 3;
        break;
      case 'Request aborted':
        this.detailsPage = 4;
        break;
      default:
        this.detailsPage = 0;
        break;
    }
  }
});
