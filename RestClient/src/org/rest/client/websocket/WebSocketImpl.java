package org.rest.client.websocket;

import com.google.gwt.file.client.Blob;

public class WebSocketImpl implements WebSocket {
	WebSocketNative impl = null;
	
	private WebSocketImpl(String url){
		impl = WebSocketNative.open(url);
	}
	
	public static WebSocketImpl open(String url){
		return new WebSocketImpl(url);
	}
	
	@Override
	public int getReadyState() {
		return impl.getReadyState();
	}

	@Override
	public double getBufferedAmount() {
		return impl.getBufferedAmount();
	}

	@Override
	public String getExtension() {
		return impl.getExtension();
	}

	@Override
	public String getProtocol() {
		return impl.getProtocol();
	}

	@Override
	public void close() {
		impl.close();
	}

	@Override
	public void close(int code, String message) {
		impl.close(code, message);
	}

	@Override
	public String getBinaryType() {
		return impl.getBinaryType();
	}

	@Override
	public void send(String data) throws InvalidStateError {
		impl.send(data);
	}

	@Override
	public void send(Blob data) throws InvalidStateError {
		impl.send(data);
	}

	@Override
	public void addOpenHandler(SocketOpenHandler handler) {
		impl.addOpenHandler(handler);
	}

	@Override
	public void addErrorHandler(SocketErrorHandler handler) {
		impl.addErrorHandler(handler);
	}

	@Override
	public void addCloseHandler(SocketCloseHandler handler) {
		impl.addCloseHandler(handler);
	}

	@Override
	public void addMessageHandler(SocketMessageHandler handler) {
		impl.addMessageHandler(handler);
	}

}
