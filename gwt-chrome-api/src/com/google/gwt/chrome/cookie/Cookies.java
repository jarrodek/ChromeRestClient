package com.google.gwt.chrome.cookie;

import com.google.gwt.core.client.JsArray;

/**
 * Access to Chrome Cookies API.
 * 
 * @author Paweł Psztyć
 * 
 */
public class Cookies {
	/**
	 * Create with GWT.create method.
	 */
	protected Cookies(){}
	
	public interface ChromeCookieHandler {
		/**
		 * See {@link ChromeCookie} for more informations.
		 * @param cookie Contains details about the cookie. This parameter is null if no such cookie was found.
		 */
		void onCookie(ChromeCookie cookie);
	}
	public interface ChromeCookiesHandler {
		/**
		 * See {@link ChromeCookie} for more informations.
		 * @param cookie Contains details about the cookie. This parameter is null if no such cookie was found.
		 */
		void onCookies(JsArray<ChromeCookie> cookies);
	}
	public interface CookieRemoveHandler {
		/**
		 * @param cookie Contains details about the cookie that's been removed.
		 */
		void onRemove(CookieQuery query);
		/**
		 * If removal failed for any reason "chrome.runtime.lastError" will be set to message parameter.
		 * @param message
		 */
		void onError(String message);
	}
	public interface CookiesStoreHandler {
		/**
		 * See {@link CookieStore} for more informations.
		 * @param cookieStores All the existing cookie stores.
		 */
		void onCookieStore(JsArray<CookieStore> cookieStores);
	}

	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	public static final native boolean isSupported()/*-{
		return !!($wnd.chrome.cookies);
	}-*/;
	
	/**
	 * Retrieves information about a single cookie. If more than one cookie of the same name exists for the given URL, the one with the longest path will be returned. For cookies with the same path length, the cookie with the earliest creation time will be returned.
	 * @param details Details to identify the cookie being retrieved.
	 * @param handler The callback parameter.
	 */
	public final native void get(CookieQuery details, ChromeCookieHandler handler) /*-{
		$wnd.chrome.cookies.get(details, $entry(function(cookie){
			handler.@com.google.gwt.chrome.cookie.Cookies.ChromeCookieHandler::onCookie(Lcom/google/gwt/chrome/cookie/ChromeCookie;)(cookie);
		}));
	}-*/;
	/**
	 * Retrieves all cookies from a single cookie store that match the given information. The cookies returned will be sorted, with those with the longest path first. If multiple cookies have the same path length, those with the earliest creation time will be first.
	 * @param details Information to filter the cookies being retrieved.
	 * @param handler The callback parameter.
	 */
	public final native void getAll(CookieQuery details, ChromeCookiesHandler handler) /*-{
		$wnd.chrome.cookies.get(details, $entry(function(cookie){
			handler.@com.google.gwt.chrome.cookie.Cookies.ChromeCookieHandler::onCookie(Lcom/google/gwt/chrome/cookie/ChromeCookie;)(cookie);
		}));
	}-*/;
	
	/**
	 * Sets a cookie with the given cookie data; may overwrite equivalent cookies if they exist.
	 * @param details Details about the cookie being set.
	 * @param handler The callback parameter
	 */
	public final native void set(ChromeCookieCreateProperties details, ChromeCookieHandler handler) /*-{
		$wnd.chrome.cookies.set(details, $entry(function(cookie){
			handler.@com.google.gwt.chrome.cookie.Cookies.ChromeCookieHandler::onCookie(Lcom/google/gwt/chrome/cookie/ChromeCookie;)(cookie);
		}));
	}-*/;
	/**
	 * Deletes a cookie by name.
	 * @param details Information to identify the cookie to remove.
	 * @param handler The callback parameter
	 */
	public final native void remove(CookieQuery details, CookieRemoveHandler handler) /*-{
		$wnd.chrome.cookies.remove(details, $entry(function(details){
			if($wnd.chrome.runtime.lastError){
				handler.@com.google.gwt.chrome.cookie.Cookies.CookieRemoveHandler::onError(Ljava/lang/String;)($wnd.chrome.runtime.lastError);
				return;
			}
			handler.@com.google.gwt.chrome.cookie.Cookies.CookieRemoveHandler::onRemove(Lcom/google/gwt/chrome/cookie/CookieQuery;)(details);
		}));
	}-*/;
	/**
	 * Lists all existing cookie stores.
	 * @param handler The callback parameter
	 */
	public final native void getAllCookieStores(CookiesStoreHandler handler) /*-{
		$wnd.chrome.cookies.get(details, $entry(function(cookieStores){
			handler.@com.google.gwt.chrome.cookie.Cookies.CookiesStoreHandler::onCookieStore(Lcom/google/gwt/core/client/JsArray;)(cookieStores);
		}));
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
	public final native void addChangeHandler(ChromeCookieChangeCallback callback)/*-{
		var clb = $entry(function(changeInfo) {
			callback.@com.google.gwt.chrome.cookie.ChromeCookieChangeCallback::onChange(Lcom/google/gwt/chrome/cookie/ChromeCookieChange;)(changeInfo);
		});
		chrome.cookies.onChanged.addListener(clb);
	}-*/;
}
