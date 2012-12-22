package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
import com.google.gwt.chrome.def.BackgroundPageCallback;
import com.google.gwt.core.client.JavaScriptObject;
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
	 * @param data JSON string to pass
	 */
	public void postMessage(String payload, String data);
	/**
	 * Send message to background page via extension's message passing system.
	 * @param payload Payload string
	 * @param data any data to pass
	 */
	public void postMessage(String payload, JavaScriptObject data);
	/**
	 * Send message to background page via extension's message passing system.
	 * @param payload Payload string
	 * @param data JSON string to pass
	 */
	void postMessage(String payload, String data, BackgroundPageCallback callback);
	/**
	 * Send message to background page via extension's message passing system.
	 * @param payload Payload string
	 * @param data any data to pass
	 * @param callback response callback
	 */
	void postMessage(String payload, JavaScriptObject data, BackgroundJsCallback callback);
	void postMessage(String payload, String data, BackgroundJsCallback callback);
}
