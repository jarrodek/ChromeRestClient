package com.restclient.client.request;

public interface ExportCallback {
	/**
	 * Called when data has been saved on server
	 */
	void onSuccess();
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
