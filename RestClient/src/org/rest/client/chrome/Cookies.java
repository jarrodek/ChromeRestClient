package org.rest.client.chrome;

/**
 * Access to Chrome Cookies API.
 * 
 * @author Paweł Psztyć
 * 
 */
public class Cookies {

	/**
	 * Returns Cookies Chrome extensions API if supported (when app is loaded as
	 * Chrome extension).
	 * 
	 * @return access to class methods or NULL if not supported.
	 */
	public static Cookies getCookiesIfSupported() {
		if (!isSupported()){
			return null;
		}
		return new Cookies();
	}

	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	private static final native boolean isSupported()/*-{
		return !!(chrome && chrome.cookies);
	}-*/;

	/**
	 * Add callback function to observe Cookie change in chrome. This method do
	 * not return registration handler because this handler can't be removed.
	 * <p>
	 * Fired when a cookie is set or removed. As a special case, note that
	 * updating a cookie's properties is implemented as a two step process: the
	 * cookie to be updated is first removed entirely, generating a notification
	 * with "cause" of "overwrite" . Afterwards, a new cookie is written with
	 * the updated values, generating a second notification with "cause"
	 * "explicit".
	 * </p>
	 * 
	 * @param callback
	 */
	public void addChangeHandler(ChromeCookieChangeCallback callback) {
		if( isSupported() ){
			_addChangeHandler(callback);
		}
	}
	
	private final native void _addChangeHandler(ChromeCookieChangeCallback callback)/*-{
		var clb = $entry(function(changeInfo) {
			callback.@org.rest.client.chrome.ChromeCookieChangeCallback::onChange(Lorg/rest/client/chrome/ChromeCookieChange;)(changeInfo);
		});
		chrome.cookies.onChanged.addListener(clb);
	}-*/;
}
