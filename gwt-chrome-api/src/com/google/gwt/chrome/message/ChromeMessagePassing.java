package com.google.gwt.chrome.message;

import com.google.gwt.chrome.def.BackgroundJsCallback;
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
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            any JavaScript object to pass as a function argument.
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, JavaScriptObject data, BackgroundJsCallback callback);
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A string argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, String data, BackgroundJsCallback callback);
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A long argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, int data, BackgroundJsCallback callback);
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A float argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, double data, BackgroundJsCallback callback);
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * @param data
	 *            A boolean argument to pass to the function.
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, boolean data, BackgroundJsCallback callback);
	
	/**
	 * Send message to background page via extension's message passing system.
	 * 
	 * @param payload
	 *            The payload must contain chrome API name (as string) to be
	 *            called in background page. The name must not contain chrome as
	 *            a first part of API name. For example if you want to call
	 *            chrome.storage.local.get() function the payload key the will
	 *            be "storage.local.get".
	 * 
	 * @param callback
	 *            response callback
	 */
	void postMessage(String payload, BackgroundJsCallback callback);
}
