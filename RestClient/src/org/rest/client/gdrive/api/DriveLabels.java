package org.rest.client.gdrive.api;

public class DriveLabels extends Entry {
	protected DriveLabels(){}
	
	
	
	/**
	 * Whether this file is starred by the user.
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isStarred() /*-{ return this.starred || null; }-*/;
	/**
	 * Whether this file is hidden from the user.
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isHidden() /*-{ return this.hidden || null; }-*/;
	/**
	 * Whether this file has been trashed.
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isTrashed() /*-{ return this.trashed || null; }-*/;
	/**
	 * Whether viewers are prevented from downloading this file.
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isRestricted() /*-{ return this.restricted || null; }-*/;
	/**
	 * Whether this file has been viewed by this user.
	 * @return value or NULL if excluded from response
	 */
	public final native Boolean isViewed() /*-{ return this.viewed || null; }-*/;
	
}
