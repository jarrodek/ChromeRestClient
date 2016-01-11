package org.rest.client.analytics;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * A legacy tracker for Google Analytics.
 * It is collecting data as a web view - not the app.
 * @author Pawel Psztyc
 *
 */
public class GoogleAnalytics {
	static JavaScriptObject service;
	static JavaScriptObject tracker;
	public static GoogleAnalyticsConfig config;
	private final static String UA_ID = "UA-18021184-6";
	
	/**
	 * Initialize Google Analytics code.
	 */
	public static void initialize() {
		/*service = initService();
		tracker = initTracker();
		initConfig();*/
	}
	
	/**
	 * Init GA service
	 * 
	 * @return GA service as a javascript object.
	 */
	private final native static JavaScriptObject initService() /*-{
		if (typeof $wnd.analytics === 'undefined' || typeof $wnd.analytics.getService === 'undefined') {
			console
					.warn('Google Analytics code not ready. Maybe you forgot to include library?');
			return null;
		}
		return $wnd.analytics.getService('AdvancedRestClient-Legacy');
	}-*/;

	/**
	 * Init tracker.
	 * 
	 * @return GA tracker.
	 */
	private final native static JavaScriptObject initTracker() /*-{
		var service = @org.rest.client.analytics.GoogleAnalytics::service;
		if (!service) {
			return null;
		}
		var tracker = service
				.getTracker(@org.rest.client.analytics.GoogleAnalytics::UA_ID);
		tracker.set('appId', 'org.rest.client');
		var version = ($wnd.chrome && $wnd.chrome.runtime && $wnd.chrome.runtime.getManifest) ? $wnd.chrome.runtime.getManifest().version : 'Unknown';
		//ga('legacy.set', 'appVersion', version);
		tracker.set('dimension2', version);
		var raw = $wnd.navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./);
		var chromeVer = raw ? raw[2] : '(not set)';
		tracker.set('dimension1', chromeVer);
		if ($wnd.chrome && $wnd.chrome.storage && $wnd.chrome.storage.sync) {
		  $wnd.chrome.storage.sync.get({
		    'appuid': null
		  }, function(data) {
		    if (data.appuid) {
		      tracker.set('userId', data.appuid);
		    } else {
		      data.appuid = $wnd.arc.app.utils.uuid();
		      $wnd.chrome.storage.sync.set(data, function() {
		        tracker.set('userId', data.appuid);
		      });
		    }
		  });
		}
		return tracker;
	}-*/;
	
	/**
	 * Initialize GA config object.
	 */
	private final static native void initConfig() /*-{
		var service = @org.rest.client.analytics.GoogleAnalytics::service;
		if (!service) {
			return null;
		}
		service.getConfig().addCallback($entry(function(config){
			@org.rest.client.analytics.GoogleAnalytics::config = config;
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
		$wnd.ga('legacy.send', {
		  hitType: 'event',
		  eventCategory: category,
		  eventAction: action,
		  eventLabel: label
		});
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
	 * @param value
	 * 			  Event value
	 */
	public final static native void sendEvent(String category, String action, String label, int value) /*-{
		$wnd.ga('legacy.send', {
		  hitType: 'event',
		  eventCategory: category,
		  eventAction: action,
		  eventLabel: label,
		  eventValue: value
		});
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
	public final static native void sendPageView(String name) /*-{
		$wnd.ga('legacy.send', 'pageview', name);
	}-*/;
	/**
	 * Send an exception information to the GA server.
	 * It will be analyzed how often different exceptions occurred.
	 * Notice:
	 * This method must not send any request / response / user data
	 * to GA server.
	 * 
	 * @param message An exception message to be send.
	 */
	public final static native void sendException(String message) /*-{
		$wnd.ga('legacy.send', 'exception', {
	        'exDescription': '' + message,
	        'exFatal': false
	    });
	}-*/;
	
	
}
