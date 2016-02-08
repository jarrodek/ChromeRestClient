package org.rest.client.dom.worker;

public interface WorkerMessageHandler {
	void onMessage(String message); // NO_UCD (unused code)
	void onError(WebWorkerError err); // NO_UCD (unused code)
}
