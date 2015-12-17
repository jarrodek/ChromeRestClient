package com.google.gwt.chrome.tabs;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * A queryInfo object to be used with chrome.tabs.query. Use GWT.create to
 * initialize this class. All parameters are optional.
 * 
 * @author Pawel Psztyc
 *
 */
public final class TabQuery extends JavaScriptObject {
	protected TabQuery() {
	}

	/**
	 * Whether the tabs are active in their windows. Optional.
	 * 
	 * @param active
	 * @return
	 */
	public final native TabQuery setActive(boolean active) /*-{
		this.active = active;
	}-*/;

	/**
	 * Whether the tabs are pinned.
	 * 
	 * @param pinned
	 * @return
	 */
	public final native TabQuery setPinned(boolean pinned) /*-{
		this.pinned = pinned;
	}-*/;

	/**
	 * Whether the tabs are audible.
	 * 
	 * @param audible
	 * @return
	 */
	public final native TabQuery setAudible(boolean audible) /*-{
		this.audible = audible;
	}-*/;

	/**
	 * Whether the tabs are muted.
	 * 
	 * @param muted
	 * @return
	 */
	public final native TabQuery setMuted(boolean muted) /*-{
		this.muted = muted;
	}-*/;

	/**
	 * Whether the tabs are highlighted.
	 * 
	 * @param highlighted
	 * @return
	 */
	public final native TabQuery setHighlighted(boolean highlighted) /*-{
		this.highlighted = highlighted;
	}-*/;

	/**
	 * Whether the tabs are in the current window.
	 * 
	 * @param currentWindow
	 * @return
	 */
	public final native TabQuery setCurrentWindow(boolean currentWindow) /*-{
		this.currentWindow = currentWindow;
	}-*/;

	/**
	 * Whether the tabs are in the last focused window.
	 * 
	 * @param lastFocusedWindow
	 * @return
	 */
	public final native TabQuery setLastFocusedWindow(boolean lastFocusedWindow) /*-{
		this.lastFocusedWindow = lastFocusedWindow;
	}-*/;

	/**
	 * Whether the tabs have completed loading.
	 * 
	 * @param status
	 *            One of "loading", or "complete"
	 * @return
	 */
	public final native TabQuery setStatus(String status) /*-{
		this.status = status;
	}-*/;

	/**
	 * Match page titles against a pattern.
	 * 
	 * @param title
	 * @return
	 */
	public final native TabQuery setTitle(String title) /*-{
		this.title = title;
	}-*/;

	/**
	 * The ID of the parent window, or windows.WINDOW_ID_CURRENT for the current
	 * window.
	 * 
	 * @param windowId
	 * @return
	 */
	public final native TabQuery setWindowId(Integer windowId) /*-{
		this.windowId = windowId;
	}-*/;

	/**
	 * The type of window.
	 * 
	 * @param windowType
	 *            one of "normal", "popup", "panel", "app", or "devtools"
	 * @return
	 */
	public final native TabQuery setWindowType(String windowType) /*-{
		this.windowType = windowType;
	}-*/;

	/**
	 * The position of the tabs within their windows.
	 * 
	 * @param index
	 * @return
	 */
	public final native TabQuery setIndex(Integer index) /*-{
		this.index = index;
	}-*/;
}
