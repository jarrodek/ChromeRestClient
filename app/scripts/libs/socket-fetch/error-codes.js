export class HttpErrorCodes {
  /**
   * @return {Object} List of known status codes
   */
  static get codes() {
    return {
      1: 'An asynchronous IO operation is not yet complete.',
      2: 'A generic failure occurred.',
      3: 'An operation was aborted (due to user action)',
      4: 'An argument to the function is incorrect.',
      5: 'The handle or file descriptor is invalid',
      6: 'The file or directory cannot be found',
      7: 'An operation timed out',
      8: 'The file is too large',
      9: 'An unexpected error.  This may be caused by a programming ' +
        'mistake or an invalid assumption',
      10: 'Permission to access a resource, other than the network, was denied',
      11: 'The operation failed because of unimplemented functionality',
      12: 'There were not enough resources to complete the operation',
      13: 'Memory allocation failed',
      14: 'The file upload failed because the file\'s modification ' +
        'time was different from the expectation',
      15: 'The socket is not connected',
      16: 'The file already exists',
      17: 'The path or file name is too long',
      18: 'Not enough room left on the disk',
      19: 'The file has a virus',
      20: 'The client chose to block the request',
      21: 'The network changed',
      22: 'The request was blocked by the URL blacklist ' +
        'configured by the domain administrator',
      23: 'The socket is already connected',
      100: 'A connection was closed (corresponding to a TCP FIN)',
      101: 'A connection was reset (corresponding to a TCP RST)',
      102: 'A connection attempt was refused',
      103: 'A connection timed out as a result of not receiving an ACK for ' +
        'data sent. This can include a FIN packet that did not get ACK\'d',
      104: 'A connection attempt failed',
      105: 'The host name could not be resolved',
      106: 'The Internet connection has been lost',
      107: 'An SSL protocol error occurred',
      108: 'The IP address or port number is invalid (e.g., cannot connect ' +
        'to the IP address 0 or the port 0)',
      109: 'The IP address is unreachable.  This usually means that there ' +
        'is no route to the specified host or network',
      110: 'The server requested a client certificate for SSL client ' +
        'authentication',
      111: 'A tunnel connection through the proxy could not be established',
      112: 'No SSL protocol versions are enabled',
      113: 'The client and server don\'t support a common SSL protocol ' +
        'version or cipher suite',
      114: 'The server requested a renegotiation (rehandshake)',
      115: 'The proxy requested authentication (for tunnel establishment) ' +
        'with an unsupported method',
      116: 'During SSL renegotiation (rehandshake), the server sent a ' +
        'certificate with an error',
      117: 'The SSL handshake failed because of a bad or missing client' +
        ' certificate',
      118: 'A connection attempt timed out',
      119: 'There are too many pending DNS resolves, so a request in the ' +
        'queue was aborted',
      120: 'Failed establishing a connection to the SOCKS proxy server for ' +
        'a target host',
      121: 'The SOCKS proxy server failed establishing connection to the ' +
        'target host because that host is unreachable',
      122: 'The request to negotiate an alternate protocol failed',
      123: 'The peer sent an SSL no_renegotiation alert message',
      124: 'Winsock sometimes reports more data written than passed.  This ' +
        'is probably due to a broken LSP',
      125: 'An SSL peer sent us a fatal decompression_failure alert.',
      126: 'An SSL peer sent us a fatal bad_record_mac alert',
      127: 'The proxy requested authentication (for tunnel establishment)',
      128: 'A known TLS strict server didn\'t offer the renegotiation ' +
        'extension',
      129: 'The SSL server attempted to use a weak ephemeral ' +
        'Diffie-Hellman key',
      130: 'Could not create a connection to the proxy server.',
      131: 'A mandatory proxy configuration could not be used.',
      133: 'We\'ve hit the max socket limit for the socket pool ' +
        'while preconnecting.',
      134: 'The permission to use the SSL client certificate\'s ' +
        'private key was denied',
      135: 'The SSL client certificate has no private key',
      136: 'The certificate presented by the HTTPS Proxy was invalid',
      137: 'An error occurred when trying to do a name resolution (DNS)',
      138: 'Permission to access the network was denied.',
      139: 'The request throttler module cancelled this request to avoid DDOS',
      140: 'A request to create an SSL tunnel connection through the HTTPS ' +
        'proxy received a non-200 (OK) and non-407 (Proxy Auth) response.',
      141: 'We were unable to sign the CertificateVerify data of an SSL ' +
        'client auth handshake with the client certificate\'s private key',
      142: 'The message was too large for the transport',
      143: 'A SPDY session already exists, and should be used instead of ' +
        'this connection',
      145: 'Websocket protocol error.',
      146: 'Connection was aborted for switching to another ptotocol.',
      147: 'Returned when attempting to bind an address that is already in use',
      148: 'An operation failed because the SSL handshake has not completed',
      149: 'SSL peer\'s public key is invalid',
      150: 'The certificate didn\'t match the built-in public key pins for ' +
        'the host name',
      151: 'Server request for client certificate did not contain any ' +
        'types we support',
      152: 'Server requested one type of cert, then requested a different ' +
        'type while the first was still being generated',
      153: 'An SSL peer sent us a fatal decrypt_error alert. ',
      154: 'There are too many pending WebSocketJob instances, so the new ' +
        'job was not pushed to the queue',
      155: 'There are too many active SocketStream instances, so the new ' +
        'connect request was rejected',
      156: 'The SSL server certificate changed in a renegotiation',
      157: 'The SSL server indicated that an unnecessary TLS version ' +
        'fallback was performed',
      158: 'Certificate Transparency: All Signed Certificate ' +
        'Timestamps failed to verify',
      159: 'The SSL server sent us a fatal unrecognized_name alert',
      300: 'The URL is invalid',
      301: 'The scheme of the URL is disallowed',
      302: 'The scheme of the URL is unknown',
      310: 'Attempting to load an URL resulted in too many redirects',
      311: 'Attempting to load an URL resulted in an unsafe redirect ' +
        '(e.g., a redirect to file: is considered unsafe)',
      312: 'Attempting to load an URL with an unsafe port number.',
      320: 'The server\'s response was invalid',
      321: 'Error in chunked transfer encoding',
      322: 'The server did not support the request method',
      323: 'The response was 407 (Proxy Authentication Required), yet ' +
        'we did not send the request to a proxy',
      324: 'The server closed the connection without sending any data',
      325: 'The headers section of the response is too large',
      326: 'The PAC requested by HTTP did not have a valid status ' +
        'code (non-200)',
      327: 'The evaluation of the PAC script failed',
      328: 'The response was 416 (Requested range not satisfiable) ' +
        'and the server cannot satisfy the range requested',
      329: 'The identity used for authentication is invalid',
      330: 'Content decoding of the response body failed',
      331: 'An operation could not be completed because all network ' +
        'IO is suspended',
      332: 'FLIP data received without receiving a SYN_REPLY on the stream',
      333: 'Converting the response to target encoding failed',
      334: 'The server sent an FTP directory listing in a format we do ' +
        'not understand',
      335: 'Attempted use of an unknown SPDY stream id',
      336: 'There are no supported proxies in the provided list',
      337: 'There is a SPDY protocol error',
      338: 'Credentials could not be established during HTTP Authentication',
      339: 'An HTTP Authentication scheme was tried which is not ' +
        'supported on this machine',
      340: 'Detecting the encoding of the response failed',
      341: '(GSSAPI) No Kerberos credentials were available ' +
        'during HTTP Authentication',
      342: 'An unexpected, but documented, SSPI or GSSAPI status ' +
        'code was returned',
      343: 'The environment was not set up correctly for authentication',
      344: 'An undocumented SSPI or GSSAPI status code was returned',
      345: 'The HTTP response was too big to drain',
      346: 'The HTTP response contained multiple distinct ' +
        'Content-Length headers',
      347: 'SPDY Headers have been received, but not all of them - ' +
        'status or version headers are missing, so we\'re expecting ' +
        'additional frames to complete them',
      348: 'No PAC URL configuration could be retrieved from DHCP.',
      349: 'The HTTP response contained multiple Content-Disposition headers',
      350: 'The HTTP response contained multiple Location headers',
      351: 'SPDY server refused the stream. Client should retry.' +
        ' This should never be a user-visible error',
      352: 'SPDY server didn\'t respond to the PING message',
      353: 'The request couldn\'t be completed on an HTTP pipeline. ' +
        'Client should retry',
      354: 'The HTTP response body transferred fewer bytes than were ' +
        'advertised by the Content-Length header when the connection is closed',
      355: 'The HTTP response body is transferred with Chunked-Encoding, but ' +
        'the terminating zero-length chunk was never sent when the ' +
        'connection is closed',
      356: 'There is a QUIC protocol error',
      357: 'The HTTP headers were truncated by an EOF',
      358: 'The QUIC crytpo handshake failed.',
      359: 'An https resource was requested over an insecure QUIC connection',
      501: 'The server\'s response was insecure (e.g. there was a cert error)',
      502: 'The server responded to a <keygen> with a generated client cert ' +
        'that we don\'t have the matching private key for',
      503: 'An error adding to the OS certificate database ' +
        '(e.g. OS X Keychain)',
      800: 'DNS resolver received a malformed response',
      801: 'DNS server requires TCP',
      802: 'DNS server failed.',
      803: 'DNS transaction timed out',
      804: 'The entry was not found in cache, for cache-only lookups',
      805: 'Suffix search list rules prevent resolution of the given host name',
      806: 'Failed to sort addresses according to RFC3484'
    };
  }

  static get netCodes() {
    return {
      'ECONNREFUSED': 102,
      'ECONNABORTED': 146,
      'ECONNRESET': 101
    };
  }

  /**
   * @param {Number} code Error code
   * @return {String} Message associated with the code.
   */
  static getCodeMessage(code) {
    if (typeof code === 'string') {
      if (isNaN(code)) {
        const mapping = HttpErrorCodes.netCodes;
        if (mapping[code]) {
          code = mapping[code];
        }
      } else {
        code = Number(code);
      }
    }
    const errorCodes = HttpErrorCodes.codes;
    if (code in errorCodes) {
      return errorCodes[code];
    } else {
      return 'Unknown error';
    }
  }
}
