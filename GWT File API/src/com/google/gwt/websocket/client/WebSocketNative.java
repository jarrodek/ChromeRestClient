package com.google.gwt.websocket.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.file.client.Blob;

public class WebSocketNative extends JavaScriptObject implements WebSocket {
	
	protected WebSocketNative(){}
	
	/**
	 * Crate new socket object and open connection
	 * @return
	 */
	public static native WebSocketNative open(String url) /*-{
		var connection = new $wnd.WebSocket(url);
		return connection;
	}-*/;
	
	
	@Override
	public final native int getReadyState() /*-{
		return this.readyState;
	}-*/;

	@Override
	public final native double getBufferedAmount() /*-{
		return this.bufferedAmount;
	}-*/;

	@Override
	public final native String getExtension() /*-{
		return this.extensions;
	}-*/;

	@Override
	public final native String getProtocol() /*-{
		return this.protocol;
	}-*/;

	@Override
	public final native void close() /*-{
		this.close();
	}-*/;

	@Override
	public final native void close(int code, String message) /*-{
		this.close(code, message);
	}-*/;

	@Override
	public final native String getBinaryType() /*-{
		return this.binaryType;
	}-*/;

	@Override
	public final native void send(String data) throws InvalidStateError /*-{
		try{
			this.send(data);
		} catch(e){
//			var ex = new @com.google.gwt.websocket.client.InvalidStateError::new()();
			throw e;
		}
	}-*/;

	@Override
	public final native void send(Blob data) throws InvalidStateError /*-{
		try{
			this.send(data);
		} catch(e){
//			var ex = new @com.google.gwt.websocket.client.InvalidStateError::new()();
			throw e;
		}
	}-*/;

	@Override
	public final native void addOpenHandler(SocketOpenHandler handler) /*-{
		var callback = $entry(function(e){
			handler.@com.google.gwt.websocket.client.SocketOpenHandler::onOpen()();
		});
		this.addEventListener('open',callback,false);
	}-*/;

	@Override
	public final native void addErrorHandler(SocketErrorHandler handler) /*-{
		var callback = $entry(function(e){
			handler.@com.google.gwt.websocket.client.SocketErrorHandler::onError()();
		});
		this.addEventListener('error',callback,false);
	}-*/;

	@Override
	public final native void addCloseHandler(SocketCloseHandler handler) /*-{
		var callback = $entry(function(e){
			handler.@com.google.gwt.websocket.client.SocketCloseHandler::onClose()();
		});
		this.addEventListener('close',callback,false);
	}-*/;

	@Override
	public final native void addMessageHandler(SocketMessageHandler handler) /*-{
		var callback = $entry(function(e){
			e.created = Date.now();
			handler.@com.google.gwt.websocket.client.SocketMessageHandler::onMessage(Lcom/google/gwt/websocket/client/SocketMessage;)(e);
		});
		this.addEventListener('message',callback,false);
	}-*/;

}
