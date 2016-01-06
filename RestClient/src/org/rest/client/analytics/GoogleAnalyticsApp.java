package org.rest.client.analytics;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Google Analytics App tracking. See
 * {@link https://developer.chrome.com/apps/analytics} for more info
 * 
 * @author Pawel Psztyc
 *
 */
public class GoogleAnalyticsApp {

	static JavaScriptObject service;
	static JavaScriptObject tracker;
	public static GoogleAnalyticsConfig config;
	private final static String UA_ID = "UA-18021184-14";

	/**
	 * Initialize Google Analytics code.
	 */
	public static void initialize() {
		service = initService();
		tracker = initTracker();
		initConfig();
	}

	/**
	 * Init GA service
	 * 
	 * @return GA service as a javascript object.
	 */
	private final native static JavaScriptObject initService() /*-{
		if (typeof $wnd.analytics === 'undefined' || typeof $wnd.analytics.getService === 'undefined') {
			console
					.error('Google Analytics code not ready. Maybe you forgot to include library?');
			return null;
		}
		return $wnd.analytics.getService('AdvancedRestClient');
	}-*/;

	/**
	 * Init tracker.
	 * 
	 * @return GA tracker.
	 */
	private final native static JavaScriptObject initTracker() /*-{
		var service = @org.rest.client.analytics.GoogleAnalyticsApp::service;
		if (!service) {
			return null;
		}
		return service
				.getTracker(@org.rest.client.analytics.GoogleAnalyticsApp::UA_ID);
	}-*/;
	
	/**
	 * Initialize GA config object.
	 */
	private final static native void initConfig() /*-{
		var service = @org.rest.client.analytics.GoogleAnalyticsApp::service;
		if (!service) {
			return null;
		}
		service.getConfig().addCallback($entry(function(config){
			@org.rest.client.analytics.GoogleAnalyticsApp::config = config;
		}));
	}-*/;

	/**
	 * Track user actions using an
	 * {@link https://support.google.com/analytics/answer/1033068} Event. Events
	 * have an optional numeric value that is averaged together by Google
	 * Analytics.
	 * 
	 * @param category
	 *            Event category
	 * @param action
	 *            Event action
	 * @param label
	 *            Event label
	 */
	public final static native void sendEvent(String category, String action, String label) /*-{
		var tracker = @org.rest.client.analytics.GoogleAnalyticsApp::tracker;
		if (!tracker) {
			return null;
		}
		tracker.sendEvent(category, action, label);
	}-*/;

	/**
	 * When starting your app, or changing "places" in your app, you should
	 * always send an AppView hit. AppView information appears in the
	 * "Real-Time" reporting section in Google Analytics reporting for your
	 * property.
	 * 
	 * @param name
	 *            Screen name to track
	 */
	public final static native void sendScreen(String name) /*-{
		var tracker = @org.rest.client.analytics.GoogleAnalyticsApp::tracker;
		if (!tracker) {
			return null;
		}
		
		tracker.sendAppView(name);
	}-*/;
	
	
}
