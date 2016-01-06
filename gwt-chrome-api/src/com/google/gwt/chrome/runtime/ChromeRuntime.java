package com.google.gwt.chrome.runtime;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;

/**
 * Interface for chrome.runtime API. This will not include getBackgroundPage()
 * function because there is no way to translate Your background page to GWT
 * 
 * @author jarrod
 * 
 */
public interface ChromeRuntime {

	public interface RuntimeUpdateCheckHandler {
		/**
		 * 
		 * @param status
		 *            Result of the update check. One of "throttled",
		 *            "no_update", or "update_available"
		 * @param version
		 *            Optional, if an update is available, this contains more
		 *            information about the available update. Null otherwise.
		 */
		void onResult(String status, String version);
		void onError(String message);
	}

	public interface RuntimeHandler {
		void onActionPerformed();
		void onError(String message);
	}

	public interface RuntimeStringHandler {
		void onResult(String result);
		void onError(String message);
	}

	public interface RuntimeJsonObjectHandler {
		void onResult(JSONObject result);
		void onError(String message);
	}
	
	public interface RuntimeObjectHandler {
		void onResult(Object result);
		void onError(String message);
	}

	public interface ManifestHandler {
		void onManifest(ManifestDetails manifest);
		void onError(String message);
	}

	public interface PlatformInfoHandler {
		void onInfo(PlatformInfo info);
	}

	/**
	 * 
	 * @return The ID of the extension/app.
	 */
	void getId(RuntimeStringHandler handler);

	/**
	 * Open your Extension's options page, if possible. The precise behavior may
	 * depend on your manifest's options_ui or options_page key, or what Chrome
	 * happens to support at the time. For example, the page may be opened in a
	 * new tab, within chrome://extensions, within an App, or it may just focus
	 * an open options page. It will never cause the caller page to reload. If
	 * your Extension does not declare an options page, or Chrome failed to
	 * create one for some other reason, the callback will set lastError.
	 * 
	 * @param handler
	 */
	void openOptionsPage(RuntimeHandler handler);

	/**
	 * 
	 * @return Returns details about the app or extension from the manifest
	 */
	void getManifest(ManifestHandler handler);

	/**
	 * Converts a relative path within an app/extension install directory to a
	 * fully-qualified URL.
	 * 
	 * @param path
	 *            A path to a resource within an app/extension expressed
	 *            relative to its install directory.
	 * @return fully-qualified URL to resource
	 */
	void getURL(String path, RuntimeStringHandler handler);

	/**
	 * Sets the URL to be visited upon uninstallation. This may be used to clean
	 * up server-side data, do analytics, and implement surveys. Maximum 255
	 * characters. This API is available since Chrome 41.
	 * 
	 * @param url
	 *            URL to be opened after the extension is uninstalled. This URL
	 *            must have an http: or https: scheme. Set an empty string to
	 *            not open a new tab upon uninstallation.
	 * @param handler
	 *            Called when the uninstall URL is set. If the given URL is
	 *            invalid, runtime.lastError will be set.
	 */
	void setUninstallURL(String url, RuntimeHandler handler);

	/**
	 * Reloads the app or extension. This method is not supported in kiosk mode.
	 * For kiosk mode, use chrome.runtime.restart() method.
	 */
	void reload();

	/**
	 * Requests an update check for this app/extension.
	 */
	void requestUpdateCheck(RuntimeUpdateCheckHandler handler);
	/**
	 * Restart the ChromeOS device when the app runs in kiosk mode. Otherwise, it's no-op.
	 */
	void restart();

	/**
	 * Sends a single message to event listeners within your extension/app or a
	 * different extension/app. Similar to runtime.connect but only sends a
	 * single message, with an optional response. If sending to your extension,
	 * the runtime.onMessage event will be fired in each page, or
	 * runtime.onMessageExternal, if a different extension. Note that extensions
	 * cannot send messages to content scripts using this method. To send
	 * messages to content scripts, use tabs.sendMessage.
	 * 
	 * @param extensionId
	 *            Optional. The ID of the extension/app to send the message to.
	 *            If omitted, the message will be sent to your own
	 *            extension/app. Required if sending messages from a web page
	 *            for web messaging.
	 * @param message
	 * @param options
	 *            Optional. "includeTlsChannelId" (boolean) Whether the TLS
	 *            channel ID will be passed into onMessageExternal for processes
	 *            that are listening for the connection event.
	 * @param handler
	 *            The JSON response object sent by the handler of the message.
	 */
	void sendMessage(String extensionId, Object message, JavaScriptObject options, RuntimeJsonObjectHandler handler);

	/**
	 * Send a single message to a native application.
	 * 
	 * @param application
	 *            The name of the native messaging host.
	 * @param message
	 *            The message that will be passed to the native messaging host.
	 * @param handler
	 *            It should be a function that will have one parameter:
	 *            `response` - The response message sent by the native messaging
	 *            host. If an error occurs while connecting to the native
	 *            messaging host, the callback will be called with no arguments
	 *            and runtime.lastError will be set to the error message.
	 */
	void sendNativeMessage(String application, Object message, RuntimeObjectHandler handler);

	/**
	 * Returns information about the current platform.
	 * 
	 * @param handler
	 *            Called with results
	 */
	void getPlatformInfo(PlatformInfoHandler handler);

	/**
	 * Fired when the extension is first installed, and on each update to a new
	 * version.
	 * 
	 * @param handler
	 */
	void addOnInstalledHandler(RuntimeHandler handler);

	/**
	 * Sent to the event page just before it is unloaded. This gives the
	 * extension opportunity to do some clean up. Note that since the page is
	 * unloading, any asynchronous operations started while handling this event
	 * are not guaranteed to complete. If more activity for the event page
	 * occurs before it gets unloaded the onSuspendCanceled event will be sent
	 * and the page won't be unloaded.
	 * 
	 * @param handler
	 */
	void addOnSuspendHandler(RuntimeHandler handler);

	/**
	 * Sent after {@link #addOnSuspendHandler()} to indicate that the app won't
	 * be unloaded after all.
	 * 
	 * @param handler
	 */
	void addOnSuspendCanceledHandler(RuntimeHandler handler);
}
