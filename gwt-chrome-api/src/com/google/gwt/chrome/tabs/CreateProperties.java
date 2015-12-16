package com.google.gwt.chrome.tabs;

import com.google.gwt.core.client.JavaScriptObject;

public class CreateProperties extends JavaScriptObject {
	protected CreateProperties() {
	}

	/**
	 * 
	 * @param windowId
	 *            The window to create the new tab in. Defaults to the current
	 *            window.
	 */
	public final native CreateProperties setWindowId(int windowId)/*-{
		this.windowId = windowId;
		return this;
	}-*/;

	/**
	 * 
	 * @param index
	 *            The position the tab should take in the window. The provided
	 *            value will be clamped to between zero and the number of tabs
	 *            in the window.
	 * @return CreateProperties instance for chaining
	 */
	public final native CreateProperties setIndex(int index)/*-{
		this.index = index;
		return this;
	}-*/;

	/**
	 * 
	 * @param url
	 *            The URL to navigate the tab to initially. Fully-qualified URLs
	 *            must include a scheme (i.e. 'http://www.google.com', not
	 *            'www.google.com'). Relative URLs will be relative to the
	 *            current page within the extension. Defaults to the New Tab
	 *            Page.
	 * @return CreateProperties instance for chaining
	 */
	public final native CreateProperties setUrl(String url)/*-{
		this.url = url;
		return this;
	}-*/;

	/**
	 * 
	 * @param active
	 *            Whether the tab should become the active tab in the window.
	 *            Defaults to true
	 * @return CreateProperties instance for chaining
	 */
	public final native CreateProperties setActive(boolean active)/*-{
		this.active = active;
		return this;
	}-*/;

	/**
	 * 
	 * @param pinned
	 *            Whether the tab should be pinned. Defaults to false
	 * @return CreateProperties instance for chaining
	 */
	public final native CreateProperties setPinned(boolean pinned)/*-{
		this.pinned = pinned;
		return this;
	}-*/;

	/**
	 * The ID of the tab that opened this tab. If specified, the opener tab must
	 * be in the same window as the newly created tab.
	 * 
	 * @param openerTabId
	 * @return
	 */
	public final native CreateProperties setOpenerTabId(int openerTabId)/*-{
		this.openerTabId = openerTabId;
		return this;
	}-*/;
}