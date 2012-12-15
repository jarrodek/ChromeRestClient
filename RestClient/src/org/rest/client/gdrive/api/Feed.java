package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class Feed extends JavaScriptObject{
	protected Feed(){}
	
	
	public final native String getEtag() /*-{ return this.gd$etag; }-*/;
	public final native String getId() /*-{ return this.id.$t; }-*/;
	public final native String getUpdated() /*-{ return this.updated.$t; }-*/;
	public final native String getTitle() /*-{ return this.title.$t; }-*/;
	public final native JsArray<Person> getAuthor() /*-{ return this.author; }-*/;
	public final native JsArray<Entry> getEntry() /*-{ return this.entry; }-*/;
	public final native JsArray<Link> getLink() /*-{ return this.link; }-*/;
	
	public final native int getStartIndex() /*-{
		var startIndex = 0;
		if(this.openSearch$startIndex && this.openSearch$startIndex.$t){
			try{
				startIndex = parseInt(this.openSearch$startIndex.$t);
			} catch(e){}
		}
		return startIndex; 
	}-*/;
	
	public final native int getPageSize() /*-{
		var pageSize = -1;
		if(this.openSearch$itemsPerPage && this.openSearch$itemsPerPage.$t){
			try{
				pageSize = parseInt(this.openSearch$itemsPerPage.$t);
			} catch(e){}
		}
		return pageSize; 
	}-*/;
}
