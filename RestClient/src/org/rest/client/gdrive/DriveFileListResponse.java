package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public final class DriveFileListResponse extends JavaScriptObject {
	protected DriveFileListResponse(){}
	
	public native String getNextPageToken() /*-{
		return this.nextPageToken;
	}-*/;
	public native String getNextLink() /*-{
		return this.nextLink;
	}-*/;
	public native JsArray<DriveFileListItem> getItems() /*-{
		return this.items;
	}-*/;
}
