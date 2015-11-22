package org.rest.client.analytics;

public class GoogleAnalytics {

	public static native void sendEvent(String category, String action, String label) /*-{
		$wnd._gaq.push(['_trackEvent', category, action, label]);
	}-*/;

}
