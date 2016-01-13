package org.rest.client.analytics;

/**
 * A legacy tracker for Google Analytics.
 * It is collecting data as a web view - not the app.
 * @author Pawel Psztyc
 *
 */
public class GoogleAnalytics {
	/**
	 * Initialize Google Analytics code.
	 */
	public static void initialize() {}
	
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
		$wnd.arc.app.analytics.sendEvent(category, action, label);
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
		$wnd.arc.app.analytics.sendEvent(category, action, label, value);
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
		$wnd.arc.app.analytics.sendScreen(name);
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
		$wnd.arc.app.analytics.sendException(message);
	}-*/;
}
