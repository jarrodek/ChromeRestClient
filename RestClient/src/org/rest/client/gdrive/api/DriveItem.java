package org.rest.client.gdrive.api;

public class DriveItem extends DriveObject {
	protected DriveItem(){}
	/**
	 * ETag of the file.
	 * @return etag or NULL if excluded from response
	 */
	public final native String getEtag() /*-{ return this.etag || null; }-*/;
	/**
	 * A link back to this file.
	 * @return selfLink or NULL if excluded from response
	 */
	public final native String getSelfLink() /*-{ return this.selfLink || null; }-*/;
}
