package com.google.gwt.xhr2.client;
/**
 * A ready-state callback for an {@link XMLHttpRequest2} object.
 */
public interface ReadyStateChangeHandler {
	/**
	 * This is called whenever the state of the XMLHttpRequest2 changes. See
	 * {@link XMLHttpRequest2#setOnReadyStateChange}.
	 * 
	 * @param xhr
	 *            the object whose state has changed.
	 */
	void onReadyStateChange(XMLHttpRequest2 xhr);
}
