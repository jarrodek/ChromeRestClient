package org.rest.client.deprecated;

import java.util.List;

import org.rest.client.request.RequestImportListItem;

public interface ImportSuggestionsCallback {
	/**
	 * Called when error occurred.
	 * @param message Message to display to user
	 * @param exception can be null!
	 */
	void onFailure(String message, Throwable exception);
	/**
	 * Called when data has been successfully retrieved from server
	 */
	void onSuccess(List<RequestImportListItem> result);
}
