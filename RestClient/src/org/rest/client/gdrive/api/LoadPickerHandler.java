package org.rest.client.gdrive.api;
/**
 * Before file picker can be used it needs to be initialized first.
 * The app will load Google loader and load picker library.
 * 
 * @author Pawel Psztyc
 *
 */
public interface LoadPickerHandler {
	/**
	 * Called when Google Drive Picker is ready to use.
	 */
	void onLoad();
}
