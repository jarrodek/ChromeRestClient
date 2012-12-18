package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;

public final class DriveFileListItem extends JavaScriptObject {
	protected DriveFileListItem(){}
	
	public native String getCreatedDate() /*-{
		return this.createdDate;
	}-*/;
	public native String getIconLink() /*-{
		return this.iconLink;
	}-*/;
	public native String getId() /*-{
		return this.id;
	}-*/;
	public native String getTitle() /*-{
		return this.title;
	}-*/;
}
