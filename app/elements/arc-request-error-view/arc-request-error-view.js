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
    if (msg) {
      msg = msg.trim();
    }
    switch (msg) {
      case 'net::ERR_CERT_AUTHORITY_INVALID':
        this.detailsPage = 1;
        break;
      case 'net::ERR_CONNECTION_REFUSED':
        this.detailsPage = 2;
        break;
      case 'net::ERR_CERT_COMMON_NAME_INVALID':
        this.detailsPage = 3;
        break;
      case 'Request aborted':
        this.detailsPage = 4;
        break;
      case 'net::ERR_ADDRESS_UNREACHABLE':
        this.detailsPage = 5;
        break;
      case 'net::ERR_BAD_SSL_CLIENT_AUTH_CERT':
        this.detailsPage = 6;
        break;
      case 'net::ERR_BLOCKED_BY_ADMINISTRATOR':
        this.detailsPage = 7;
        break;
      case 'net::ERR_BLOCKED_BY_CLIENT':
        this.detailsPage = 8;
        break;
      case 'net::ERR_BLOCKED_ENROLLMENT_CHECK_PENDING':
        this.detailsPage = 9;
        break;
      case 'net::ERR_CERT_CONTAINS_ERRORS':
      case 'net::ERR_CERT_DATE_INVALID':
      case 'net::ERR_CERT_END':
      case 'net::ERR_CERT_ERROR_IN_SSL_RENEGOTIATION':
      case 'net::ERR_CERT_INVALID':
      case 'net::ERR_CERT_NAME_CONSTRAINT_VIOLATION':
      case 'net::ERR_CERT_NON_UNIQUE_NAME':
      case 'net::ERR_CERT_NO_REVOCATION_MECHANISM':
      case 'net::ERR_CERT_REVOKED':
      case 'net::ERR_CERT_UNABLE_TO_CHECK_REVOCATION':
      case 'net::ERR_CERT_VALIDITY_TOO_LONG':
      case 'net::ERR_CERT_WEAK_KEY':
      case 'net::ERR_CERT_WEAK_SIGNATURE_ALGORITHM':
        this.detailsPage = 10;
        break;
      case 'net::ERR_CONNECTION_CLOSED':
      case 'net::ERR_CONNECTION_RESET':
        this.detailsPage = 11;
        break;
      case 'net::ERR_CONNECTION_FAILED':
        this.detailsPage = 12;
        break;
      case 'net::ERR_CONNECTION_REFUSED':
        this.detailsPage = 13;
        break;
      case 'net::ERR_CONNECTION_TIMED_OUT':
        this.detailsPage = 14;
        break;
      case 'net::ERR_CONTENT_LENGTH_MISMATCH':
      case 'net::ERR_INCOMPLETE_CHUNKED_ENCODING':
        this.detailsPage = 15;
        break;
      case 'net::ERR_FILE_NOT_FOUND':
        this.detailsPage = 16;
        break;
      case 'net::ERR_ICANN_NAME_COLLISION':
        this.detailsPage = 17;
        break;
      case 'net::ERR_INTERNET_DISCONNECTED':
        this.detailsPage = 18;
        break;
      case 'net::ERR_NAME_NOT_RESOLVED':
        this.detailsPage = 19;
        break;
      case 'net::ERR_NAME_RESOLUTION_FAILED':
        this.detailsPage = 20;
        break;
      case 'net::ERR_NETWORK_ACCESS_DENIED':
        this.detailsPage = 21;
        break;
      case 'net::ERR_NETWORK_CHANGED':
        this.detailsPage = 22;
        break;
      case 'net::ERR_NETWORK_IO_SUSPENDED':
        this.detailsPage = 23;
        break;
      case 'net::ERR_PROXY_CONNECTION_FAILED':
        this.detailsPage = 24;
        break;
      case 'net::ERR_RESPONSE_HEADERS_MULTIPLE_CONTENT_DISPOSITION':
      case 'net::ERR_RESPONSE_HEADERS_MULTIPLE_CONTENT_LENGTH':
      case 'net::ERR_RESPONSE_HEADERS_MULTIPLE_LOCATION':
        this.detailsPage = 25;
        break;
      case 'net::ERR_SSL_FALLBACK_BEYOND_MINIMUM_VERSION':
      case 'net::ERR_SSL_PROTOCOL_ERROR':
        this.detailsPage = 26;
        break;
      case 'net::ERR_SSL_PINNED_KEY_NOT_IN_CERT_CHAIN':
        this.detailsPage = 27;
        break;
      case 'net::ERR_SSL_SERVER_CERT_BAD_FORMAT':
        this.detailsPage = 28;
        break;
      case 'net::ERR_SSL_VERSION_OR_CIPHER_MISMATCH':
        this.detailsPage = 29;
        break;
      case 'net::ERR_SSL_WEAK_SERVER_EPHEMERAL_DH_KEY':
        this.detailsPage = 30;
        break;
      case 'net::ERR_TEMPORARY_BACKOFF':
        this.detailsPage = 31;
        break;
      case 'net::ERR_TIMED_OUT':
        this.detailsPage = 32;
        break;
      case 'net::ERR_TOO_MANY_REDIRECTS':
        this.detailsPage = 33;
        break;
      default:
        this.detailsPage = 0;
        break;
    }
  }
});
