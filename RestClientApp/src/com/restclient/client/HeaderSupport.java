package com.restclient.client;

/**
 * Headers fill support interface.
 * Helpers do not directly sets a value. Rather use {@link HeaderSupportSubmitEvent} to notify listener about new value. 
 * 
 * @author Paweł Psztyć
 */
public interface HeaderSupport {
	/**
	 * Sets current value to set in dialog on load.
	 * @param value
	 */
	public void setValue(String value);
	/**
	 * Display dialog box.
	 */
	public void openDialog();
}
