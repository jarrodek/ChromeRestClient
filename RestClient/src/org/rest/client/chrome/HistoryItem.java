package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Wrapper for Chrome extensions HistoryItem object. 
 * An object encapsulating one result of a history query.
 * @author Paweł Psztyć
 * 
 */
public class HistoryItem extends JavaScriptObject {
	protected HistoryItem(){}
	
	/**
	 * The unique identifier for the item.
	 * @return the id
	 */
	public final native String getId() /*-{
		return this.id;
	}-*/;
	/**
	 * The URL navigated to by a user.
	 * @optional
	 * @return the url
	 */
	public final native String getUrl() /*-{
		return this.url;
	}-*/;
	/**
	 * The title of the page when it was last loaded.
	 * @optional
	 * @return the title
	 */
	public final native String getTitle() /*-{
		return this.title;
	}-*/;
	/**
	 * When this page was last loaded, represented in milliseconds since the epoch.
	 * @optional
	 * @return the lastVisitTime
	 */
	public final native double getLastVisitTime() /*-{
		return this.lastVisitTime;
	}-*/;
	/**
	 * The number of times the user has navigated to this page.
	 * @optional
	 * @return the visitCount
	 */
	public final native int getVisitCount() /*-{
		return this.visitCount;
	}-*/;
	/**
	 * The number of times the user has navigated to this page by typing in the address.
	 * @optional
	 * @return the typedCount
	 */
	public final native int getTypedCount() /*-{
		return this.typedCount;
	}-*/;
}
