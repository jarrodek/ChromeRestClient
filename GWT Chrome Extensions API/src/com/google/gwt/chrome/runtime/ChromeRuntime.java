package com.google.gwt.chrome.runtime;

import com.google.gwt.chrome.runtime.Runtime.ManifestHandler;
import com.google.gwt.chrome.runtime.Runtime.RuntimeHandler;
import com.google.gwt.chrome.runtime.Runtime.RuntimeStringHandler;

/**
 * Interface for chrome.runtime API. This will not include getBackgroundPage()
 * function because there is no way to translate Your background page to GWT
 * 
 * @author jarrod
 * 
 */
public interface ChromeRuntime {
	/**
	 * This will be defined during an API method callback if there was an error
	 * 
	 * @return Details about the error which occurred or NULL if no message
	 */
	void getLastError(RuntimeStringHandler handler);

	/**
	 * 
	 * @return The ID of the extension/app.
	 */
	void getId(RuntimeStringHandler handler);
	/**
	 * 
	 * @return Returns details about the app or extension from the manifest
	 */
	void getManifest(ManifestHandler handler);
	/**
	 * Converts a relative path within an app/extension install directory to a fully-qualified URL.
	 * @param path A path to a resource within an app/extension expressed relative to its install directory.
	 * @return fully-qualified URL to resource
	 */
	void getURL(String path, RuntimeStringHandler handler);
	/**
	 * Fired when the extension is first installed, and on each update to a new version.
	 * @param handler
	 */
	void addOnInstalledHandler(RuntimeHandler handler);
	/**
	 * Sent to the event page just before it is unloaded. This gives the extension opportunity to do some clean up. Note that since the page is unloading, any asynchronous operations started while handling this event are not guaranteed to complete. If more activity for the event page occurs before it gets unloaded the onSuspendCanceled event will be sent and the page won't be unloaded.
	 * @param handler
	 */
	void addOnSuspendHandler(RuntimeHandler handler);
	/**
	 * Sent after {@link #addOnSuspendHandler()} to indicate that the app won't be unloaded after all.
	 * @param handler
	 */
	void addOnSuspendCanceledHandler(RuntimeHandler handler);
}
