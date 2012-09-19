package org.rest.client.deprecated;

import java.util.HashMap;

public interface ExportCallback {
	/**
	 * Called when data has been saved on server
	 * @param gaeKeys Key - local database item ID, Value - Google App Engine Key as string
	 */
	void onSuccess(HashMap<Integer, String> gaeKeys);
	/**
	 * Called when error occurred
	 * @param message
	 * @param throwable
	 */
	void onFailure(String message, Throwable throwable);
	/**
	 * Called when user is not logged in to application.
	 */
	void onNotLoggedIn();
}
