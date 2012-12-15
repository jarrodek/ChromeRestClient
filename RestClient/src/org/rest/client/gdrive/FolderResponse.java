package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public final class FolderResponse extends JavaScriptObject {
	protected FolderResponse(){}
	
	public native String getNextPageToken() /*-{
		return this.nextPageToken;
	}-*/;
	public native String getNextLink() /*-{
		return this.nextLink;
	}-*/;
	public native JsArray<FolderItem> getItems() /*-{
		return this.items;
	}-*/;
}
