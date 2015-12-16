package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * An object encapsulating one visit to a URL.
 * 
 * @author Pawel Psztyc
 *
 */
public class VisitItem extends JavaScriptObject {
	protected VisitItem() {
	}

	/**
	 * 
	 * @return The unique identifier for the item.
	 */
	public final native String getId() /*-{
		return this.id;
	}-*/;

	/**
	 * 
	 * @return The unique identifier for this visit.
	 */
	public final native String getVisitId() /*-{
		return this.visitId;
	}-*/;

	/**
	 * 
	 * @return When this visit occurred, represented in milliseconds since the
	 *         epoch.
	 */
	public final native double getVisitTime() /*-{
		return this.visitTime;
	}-*/;

	/**
	 * 
	 * @return The visit ID of the referrer.
	 */
	public final native String getReferringVisitId() /*-{
		return this.referringVisitId;
	}-*/;

	/**
	 * The transition type for this visit from its referrer.
	 * 
	 * @return One of "link", "typed", "auto_bookmark", "auto_subframe",
	 *         "manual_subframe", "generated", "auto_toplevel", "form_submit",
	 *         "reload", "keyword", or "keyword_generated".
	 */
	public final native String getTransition() /*-{
		return this.transition;
	}-*/;

}
