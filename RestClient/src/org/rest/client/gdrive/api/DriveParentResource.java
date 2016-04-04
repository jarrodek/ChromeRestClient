package org.rest.client.gdrive.api;

class DriveParentResource extends DriveObject {
	protected DriveParentResource(){}
	
	public final native String getId() /*-{ return this.id || null; }-*/;
	public final native String getSelfLink() /*-{ return this.selfLink || null; }-*/;
	public final native String getParentLink() /*-{ return this.parentLink || null; }-*/;
	
	
}
