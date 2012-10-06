package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundPageCallback;
/**
 * There should be only one implementation of this interface.
 * 
 * @author jarrod
 *
 */
public interface ChromeMessagePassing {
	/**
	 * Send message to background page via extension's message passing system.
	 * @param payload Payload string
	 * @param data any data to pass
	 */
	public void postMessage(String payload, String data);
	/**
	 * Send message to background page via extension's message passing system.
	 * @param payload Payload string
	 * @param data any data to pass
	 */
	void postMessage(String payload, String data, BackgroundPageCallback callback);
}
