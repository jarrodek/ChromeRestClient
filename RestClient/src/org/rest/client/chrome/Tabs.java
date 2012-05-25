package org.rest.client.chrome;

import com.google.gwt.core.client.JavaScriptObject;

public class Tabs {

	public static class CreateProperties extends JavaScriptObject {
		protected CreateProperties() {
		}

		public final native static CreateProperties create()/*-{
			return {};
		}-*/;

		/**
		 * 
		 * @param windowId
		 *            The window to create the new tab in. Defaults to the
		 *            current window.
		 */
		public final native CreateProperties setWindowId(int windowId)/*-{
			this.windowId = windowId;
			return this;
		}-*/;

		/**
		 * 
		 * @param index
		 *            The position the tab should take in the window. The
		 *            provided value will be clamped to between zero and the
		 *            number of tabs in the window.
		 * @return CreateProperties instance for chaining
		 */
		public final native CreateProperties setIndex(int index)/*-{
			this.index = index;
			return this;
		}-*/;

		/**
		 * 
		 * @param url
		 *            The URL to navigate the tab to initially. Fully-qualified
		 *            URLs must include a scheme (i.e. 'http://www.google.com',
		 *            not 'www.google.com'). Relative URLs will be relative to
		 *            the current page within the extension. Defaults to the New
		 *            Tab Page.
		 * @return CreateProperties instance for chaining
		 */
		public final native CreateProperties setUrl(String url)/*-{
			this.url = url;
			return this;
		}-*/;
		/**
		 * 
		 * @param active Whether the tab should become the active tab in the window. Defaults to true
		 * @return CreateProperties instance for chaining
		 */
		public final native CreateProperties setActive(boolean active)/*-{
			this.active = active;
			return this;
		}-*/;
		/**
		 * 
		 * @param pinned Whether the tab should be pinned. Defaults to false
		 * @return CreateProperties instance for chaining
		 */
		public final native CreateProperties setPinned(boolean pinned)/*-{
			this.pinned = pinned;
			return this;
		}-*/;
	}

	private Tabs() {
	}

	public static Tabs getTabsIfSupported() {
		if (!isSupported())
			return null;
		return new Tabs();
	}

	/**
	 * Creates a new tab. <br/>
	 * <p>Note:<br/>This function can be used without requesting the <b>'tabs'</b> permission
	 * in the manifest.</p>
	 */
	public final native void create(CreateProperties props, TabCallback handler)/*-{
		var clb = $entry(function(item) {
			handler.@org.rest.client.chrome.TabCallback::onResult(Lorg/rest/client/chrome/Tab;)(item);
		});
		chrome.tabs.create(props, clb);
	}-*/;

	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	private static final native boolean isSupported()/*-{
		return !!(chrome.tabs);
	}-*/;
}
