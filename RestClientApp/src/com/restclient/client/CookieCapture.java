package com.restclient.client;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Set;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.storage.client.Storage;
import com.restclient.client.chrome.ChromeCookie;
import com.restclient.client.chrome.ChromeCookieChange;
import com.restclient.client.chrome.ChromeCookieChangeCallback;
import com.restclient.client.chrome.Cookies;

@SuppressWarnings("javadoc")
public class CookieCapture {
	
	private static boolean isInitialized = false;
	private static boolean isObserving = false;
	private static HashMap<Long, ChromeCookie> captured = new HashMap<Long, ChromeCookie>();
	
	/**
	 * Initialize Cookie capture.
	 * It can be initialized only once.
	 */
	public static void initialize(){
		if( isInitialized ) return;
		isInitialized = true;
		if( RestApp.isDebug() ){
			Log.debug("Initializing Cookie capture class.");
		}
		Cookies c = Cookies.getCookiesIfSupported();
		
		if(c == null){
			if(RestApp.isDebug()){
				Log.warn("Try to initialize cookie api when not an application. Exit.");
			}
			return;
		}
		if(RestApp.isDebug()){
			Log.debug("Has cookies support. Add handler.");
		}
		c.addChangeHandler(new ChromeCookieChangeCallback() {
			@Override
			public void onChange(ChromeCookieChange event) {
				if( !isObserving ) {
//					if( RestApp.isDebug() ){
//						Log.debug("Captured cookie change in browser but not listening.");
//					}
					return;
				}
				if(event.isRemoved()){
					if( RestApp.isDebug() ){
						Log.debug("Captured cookie change but this is remove action.");
					}
					return;
				}
				if(RestApp.isDebug()){
					Log.debug("Have new cookie. Adding to list.");
				}
				ChromeCookie cookie = event.getCookie();
				long time = new Date().getTime();
				captured.put(time, cookie);
			}
		});
	}
	/**
	 * Start cookie capture.
	 */
	public static void start(){
		if(!isInitialized) return;
		if( RestApp.isDebug() ){
			Log.debug("Recording cookies from now.");
		}
		Storage storage = Storage.getLocalStorageIfSupported();
		if( storage != null ){
			String cookiesValue = storage.getItem( RestApp.StorageKeys.COOKIES_CAPTURE );
			if( cookiesValue == null || cookiesValue.isEmpty() ){
				return;
			}
		}
		
		captured.clear();
		isObserving = true;
	}
	/**
	 * Stop observing for cookie change
	 */
	public static void stop(){
		if( RestApp.isDebug() ){
			Log.debug("Stop recordings cookies.");
		}
		isObserving = false;
	}
	/**
	 * Clear captured cookies
	 */
	public static void clear(){
		captured.clear();
		if( RestApp.isDebug() ){
			Log.debug("Cookies has been cleared.");
		}
	}
	/**
	 * Get captured cookies for domain.
	 * @param domain
	 * @return captured cookie list.
	 */
	public static List<ChromeCookie> getCookies(final String domain){
		List<ChromeCookie> result = new ArrayList<ChromeCookie>();
		Set<Long> keys = captured.keySet();
		Iterator<Long> it = keys.iterator();
		while( it.hasNext() ){
			Long ts = it.next();
			ChromeCookie c = captured.get(ts);
			if(c.getDomain().equals(domain)){
				result.add(c);
			}
		}
		if( RestApp.isDebug() ){
			Log.debug("CookieCapture::getCookies has " + result.size() + " cookies in list");
		}
		return result;
	}
	/**
	 * Get captured cookies from "fromTime" to now.
	 * @param fromTime timestamp of cookie captured time.
	 * @return list of found cookies.
	 */
	public static List<ChromeCookie> getCookies(final Long fromTime){
		List<ChromeCookie> result = new ArrayList<ChromeCookie>();
		Set<Long> keys = captured.keySet();
		Iterator<Long> it = keys.iterator();
		while( it.hasNext() ){
			Long ts = it.next();
			if( ts > fromTime ){
				continue;
			}
			result.add(captured.get(ts));
		}
		if( RestApp.isDebug() ){
			Log.debug("CookieCapture::getCookies has " + result.size() + " cookies in list");
		}
		return result;
	}
	/**
	 * Get captured cookies from "fromTime" to now and for given domain.
	 * @param fromTime timestamp of cookie captured time.
	 * @param forDomain list of found cookies.
	 * @return
	 */
	public static List<ChromeCookie> getCookies(final Long fromTime, String forDomain){
		List<ChromeCookie> result = new ArrayList<ChromeCookie>();
		Set<Long> keys = captured.keySet();
		Iterator<Long> it = keys.iterator();
		while( it.hasNext() ){
			Long ts = it.next();
			if( ts > fromTime ){
				continue;
			}
			ChromeCookie c = captured.get(ts);
			if( forDomain != null ){
				if(c.getDomain().equals(forDomain)){
					result.add(c);
				}
			} else {
				result.add(c);
			}
		}
		if( RestApp.isDebug() ){
			Log.debug("CookieCapture::getCookies has " + result.size() + " cookies in list");
		}
		return result;
	}
	/**
	 * Get all captured cookies.
	 * @return
	 */
	public static List<ChromeCookie> getCookies(){
		List<ChromeCookie> result = new ArrayList<ChromeCookie>();
		Set<Long> keys = captured.keySet();
		Iterator<Long> it = keys.iterator();
		while( it.hasNext() ){
			result.add(captured.get(it.next()));
		}
		if( RestApp.isDebug() ){
			Log.debug("CookieCapture::getCookies has " + result.size() + " cookies in list");
		}
		return result;
	}
}
