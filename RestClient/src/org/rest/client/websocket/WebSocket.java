package org.rest.client.websocket;

import com.google.gwt.file.client.Blob;

public interface WebSocket {
	
	// ready state
	/**
	 * The connection has not yet been established. When the object is created
	 * its readyState must be set to CONNECTING (0).
	 */
	public final static int CONNECTING = 0;
	/**
	 * The WebSocket connection is established and communication is possible.
	 */
	public final static int OPEN = 1;
	/**
	 * The connection is going through the closing handshake, or the close()
	 * method has been invoked.
	 */
	public final static int CLOSING = 2;
	/**
	 * The connection has been closed or could not be opened.
	 */
	public final static int CLOSED = 3;

	/**
	 * The readyState attribute represents the state of the connection. It can
	 * have the following values:
	 * <ul>
	 * <li>0 - {@link #CONNECTING}</li>
	 * <li>1 - {@link #OPEN}</li>
	 * <li>2 - {@link #CLOSING}</li>
	 * <li>3 - {@link #CLOSED}</li>
	 * </ul>
	 * 
	 * @return current ready state
	 */
	int getReadyState();

	/**
	 * The bufferedAmount attribute must return the number of bytes of
	 * application data (UTF-8 text and binary data) that have been queued using
	 * send() but that, as of the last time the event loop started executing a
	 * task, had not yet been transmitted to the network. (This thus includes
	 * any text sent during the execution of the current task, regardless of
	 * whether the user agent is able to transmit text asynchronously with
	 * script execution.) This does not include framing overhead incurred by the
	 * protocol, or buffering done by the operating system or network hardware.
	 * If the connection is closed, this attribute's value will only increase
	 * with each call to the send() method (the number does not reset to zero
	 * once the connection closes).
	 * <p>
	 * The bufferedAmount attribute can also be used to saturate the network
	 * without sending the data at a higher rate than the network can handle,
	 * though this requires more careful monitoring of the value of the
	 * attribute over time.
	 * </p>
	 * 
	 * @return
	 */
	double getBufferedAmount();

	// networking
	/**
	 * The extensions attribute returns the extensions selected by the server,
	 * if any. (Currently this will only ever be the empty string.)
	 * 
	 * @return
	 */
	String getExtension();

	/**
	 * The protocol attribute returns the subprotocol selected by the server, if
	 * any. It can be used in conjunction with the array form of the
	 * constructor's second argument to perform subprotocol negotiation.
	 * 
	 * @return
	 */
	String getProtocol();

	/**
	 * Close the connection
	 */
	void close();

	/**
	 * Close the connection and send reason
	 * 
	 * @param code
	 *            Close reason code
	 * @param message
	 *            Close reason message
	 */
	void close(int code, String message);

	// messaging
	public final static String BINARY_TYPE_BLOB = "blob";
	public final static String BINARY_TYPE_ARRAY_BUFFER = "arraybuffer";

	/**
	 * This attribute allows authors to control how binary data is exposed to
	 * scripts. By setting the attribute to "blob", binary data is returned in
	 * Blob form; by setting it to "arraybuffer", it is returned in ArrayBuffer
	 * form. User agents can use this as a hint for how to handle incoming
	 * binary data: if the attribute is set to "blob", it is safe to spool it to
	 * disk, and if it is set to "arraybuffer", it is likely more efficient to
	 * keep the data in memory. Naturally, user agents are encouraged to use
	 * more subtle heuristics to decide whether to keep incoming data in memory
	 * or not, e.g. based on how big the data is or how common it is for a
	 * script to change the attribute at the last minute. This latter aspect is
	 * important in particular because it is quite possible for the attribute to
	 * be changed after the user agent has received the data but before the user
	 * agent has fired the event for it.
	 * 
	 * @return
	 */
	String getBinaryType();

	/**
	 * The send(data) method transmits data using the connection. If the
	 * readyState attribute is CONNECTING, it must throw an InvalidStateError
	 * exception.
	 * 
	 * @param data
	 */
	void send(String data) throws InvalidStateError;

	void send(Blob data) throws InvalidStateError;

	// void send(ArrayBuffer data);
	//
	// void send(ArrayBufferView data);
	
	void addOpenHandler(SocketOpenHandler handler);
	void addErrorHandler(SocketErrorHandler handler);
	void addCloseHandler(SocketCloseHandler handler);
	void addMessageHandler(SocketMessageHandler handler);
}
