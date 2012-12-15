package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JsArray;

public class DriveList extends DriveItem {
	protected DriveList(){}
	
	public final native JsArray<DriveListItem> getItems() /*-{ return this.items; }-*/;
	public final native String getNextLink() /*-{ return this.nextLink; }-*/;
	public final native String getNextPageToken() /*-{ return this.nextPageToken; }-*/;
}
