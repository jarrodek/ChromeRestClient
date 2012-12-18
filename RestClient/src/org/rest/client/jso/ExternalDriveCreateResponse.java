package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

public final class ExternalDriveCreateResponse extends JavaScriptObject {
	protected ExternalDriveCreateResponse(){}
	
	public native boolean isError() /*-{
		return !!(this.error)
	}-*/;
	
	public native String getErrorMessage() /*-{
		return this.message || null;
	}-*/;
	
	public native ExternalDriveCreateData getData() /*-{
		return this.data || null;
	}-*/;
}
