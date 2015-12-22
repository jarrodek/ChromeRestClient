package org.rest.client.request;

/**
 * Callback function after session state check as been made. 
 * @author Pawel Psztyc
 *
 */
public interface ApplicationSessionCallback {
	/**
	 * Called when data has been successfully retrieved from server
	 */
	void onSuccess(ApplicationSession session);
}
