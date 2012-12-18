package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

public final class ExternalDriveCreateData extends JavaScriptObject {
	protected ExternalDriveCreateData(){}
	
	public native String getAction() /*-{
		return this.action;
	}-*/;
	public native String getFolderId() /*-{
		return this.folderId;
	}-*/;
	public native String getUserId() /*-{
		return this.userId;
	}-*/;
}