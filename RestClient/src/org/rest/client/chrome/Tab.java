package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;
/**
 * Details about the created tab. Will contain the ID of the new tab.
 * @author Paweł Psztyć
 *
 */
public class Tab extends JavaScriptObject {
	protected Tab(){}
	/**
	 * @return The ID of the tab. Tab IDs are unique within a browser session.
	 */
	public final native Integer getId() /*-{
		return this.id;
	}-*/;
	/**
	 * 
	 * @return The zero-based index of the tab within its window.
	 */
	public final native Integer getIndex() /*-{
		return this.index;
	}-*/;
	/**
	 * 
	 * @return The ID of the window the tab is contained within.
	 */
	public final native Integer getWindowId() /*-{
		return this.windowId;
	}-*/;
	/**
	 * 
	 * @return Whether the tab is highlighted.
	 */
	public final native Boolean getHighlighted() /*-{
		return this.highlighted;
	}-*/;
	/**
	 * 
	 * @return Whether the tab is active in its window.
	 */
	public final native Boolean getActive() /*-{
		return this.active;
	}-*/;
	/**
	 * 
	 * @return Whether the tab is pinned.
	 */
	public final native Boolean getPinned() /*-{
		return this.pinned;
	}-*/;
	/**
	 * 
	 * @return The URL the tab is displaying.
	 */
	public final native String getUrl() /*-{
		return this.url;
	}-*/;
	/**
	 * This parameter is optional and can be NULL.
	 * @return The title of the tab. This may not be available if the tab is loading.
	 */
	public final native String getTitle() /*-{
		return this.title || null;
	}-*/;
	/**
	 * This parameter is optional and can be NULL.
	 * @return The URL of the tab's favicon. This may not be available if the tab is loading.
	 */
	public final native String getFavIconUrl() /*-{
		return this.favIconUrl || null;
	}-*/;
	/**
	 * This parameter is optional and can be NULL.
	 * @return Either loading or complete.
	 */
	public final native String getStatus() /*-{
		return this.status || null;
	}-*/;
	/**
	 * 
	 * @return Whether the tab is in an incognito window.
	 */
	public final native Boolean getIncognito() /*-{
		return this.incognito;
	}-*/;
}
