package org.rest.client.headerssupport;

import com.google.gwt.core.client.Callback;

/**
 * Headers fill support interface.
 * 
 * @author Paweł Psztyć
 */
public interface HeaderSupport {
	/**
	 * Sets current value to set in dialog on load.
	 * 
	 * @param value
	 */
	public void setValue(String value);

	/**
	 * Display dialog box.
	 */
	public void openDialog();
	
	/**
	 * Sets handler to be called when user accepts results.
	 * @param callback The callback to be called.
	 */
	public void setOnResultHandler(Callback<String, String> callback);
}
