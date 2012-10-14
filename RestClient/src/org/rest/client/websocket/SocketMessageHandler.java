package org.rest.client.websocket;

public interface SocketMessageHandler {
	void onMessage(SocketMessage message);
}
