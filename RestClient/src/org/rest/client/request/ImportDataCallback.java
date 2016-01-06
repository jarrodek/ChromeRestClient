package org.rest.client.request;

import org.rest.client.jso.RequestDataJso;

import com.google.gwt.core.client.JsArray;

public interface ImportDataCallback {
	/**
	 * Called when error occurred.
	 * @param message Message to display to user
	 * @param exception can be null!
	 */
	void onFailure(String message);
	/**
	 * Called when data has been successfully retrieved from server
	 */
	void onSuccess(JsArray<RequestDataJso> result);
}
