package org.rest.client.gdrive.api;

import java.util.Date;


public class DocListEntry extends Entry {
	protected DocListEntry(){}
	
	
	
	
	public final native Date getModifiedByMeDate() /*-{ return new Date(this.docs$modifiedByMeDate.$t); }-*/;
	
}
