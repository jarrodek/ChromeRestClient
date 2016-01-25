package org.rest.client.gdrive.api;
/**
 * Handler interface for Google Picker response.
 * @author Pawel Psztyc
 *
 */
public interface PickerHandler {
	/**
	 * A callback method called when response is ready.
	 * @param response A {@link PickerResponse} object with query result data.
	 */
	public void handleResponse(PickerResponse response); // NO_UCD (unused code)
}
