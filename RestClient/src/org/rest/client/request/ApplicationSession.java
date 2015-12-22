package org.rest.client.request;

import com.google.gwt.core.client.JavaScriptObject;

public class ApplicationSession extends JavaScriptObject {
	protected ApplicationSession(){}
	
	/**
	 * User is connected to application
	 */
	public static final int CONNECTED = 1;
	/**
	 * User is not logged in 
	 */
	public static final int DISCONNECTED = 0;
	/**
	 * User status is unknown
	 */
	public static final int UNKNOWN = 2;

	/**
	 * @return the state
	 */
	public final native int getState() /*-{
		return this.state;
	}-*/;
	/**
	 * @return the userId
	 */
	public final native String getUserId() /*-{
		return this.userId || this.uid;
	}-*/;
	
	/**
	 * @return true if there was an error during the request.
	 */
	public final native boolean isError() /*-{
		if(typeof this.error === 'undefined'){
			return false;
		}
		return this.error;
	}-*/;
	/**
	 * @return the error message if {@link #isError()} return true, null otherwise
	 */
	public final native String getMessage() /*-{
		if(typeof this.message === 'undefined'){
			return null;
		}
		return this.message;
	}-*/;
}
