package org.rest.client.analytics;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Google analytics config allows read and set state 
 * if google analytics is allowed to use by the user.
 * 
 * Use GoogleAnalyticsConfig.isTrackingPermitted() to read permission state
 * and GoogleAnalyticsConfig.setTrackingPermitted(true|false) to set user preferences.
 * 
 * @author Pawel Psztyc
 *
 */
public class GoogleAnalyticsConfig extends JavaScriptObject { 
	protected GoogleAnalyticsConfig(){}
	/**
	 * Check if user disallowed tracking in app.
	 * @return false if tracking is disallowed in app.
	 */
	public final native boolean isTrackingPermitted() /*-{ return this.isTrackingPermitted(); }-*/;
	/**
	 * Set perrmission state for tracking the user.
	 * @param state True if the user can be tracked.
	 */
	public final native void setTrackingPermitted(boolean state) /*-{ this.setTrackingPermitted(state); }-*/;
}
