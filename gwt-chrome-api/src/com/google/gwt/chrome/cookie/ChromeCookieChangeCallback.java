package com.google.gwt.chrome.cookie;
/**
 * Callback function called when cookie has been changed.
 * @author Paweł Psztyć
 *
 */
public interface ChromeCookieChangeCallback {
	/**
	 * Cookie has been changed some way.
	 * See {@link ChromeCookie} for more informations.
	 * @param event
	 */
	void onChange( ChromeCookieChange event );
}
