package org.rest.client.gdrive.api;

import java.util.Date;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class Entry extends JavaScriptObject{
	protected Entry(){}
	
	public final native String getId() /*-{ return this.id.$t; }-*/;
	public final native String getEtag() /*-{ return this.gd$etag; }-*/;
	
	public final native Date getPublished() /*-{ return new Date(this.published.$t); }-*/;
	public final native Date getUpdated() /*-{ return new Date(this.updated.$t); }-*/;
	public final native String getTitle() /*-{ return this.title.$t; }-*/;
	public final native JsArray<Person> getAuthor() /*-{ return this.author; }-*/;
	public final native String getResourceId() /*-{ return this.gd$resourceId.$t; }-*/;
	public final native Person getLastModifiedBy() /*-{ return this.gd$lastModifiedBy; }-*/;
	public final native Date getLastViewedDate() /*-{ 
		return new Date(this.gd$lastViewed); 
	}-*/;
	public final native JsArray<Link> getLink() /*-{ return this.link; }-*/;
	
	//quotaBytesUsed
}
