package com.google.gwt.chrome.tabs;

public class Tabs {
	/**
	 * This class can be contructed by GWT.create();
	 */
	protected Tabs() {}
	/**
	 * Retrieves details about the specified tab.
	 * @param tabId Tab ID
	 * @param handler The callback parameter
	 */
	public final native void get(int tabId, TabCallback handler)/*-{
		$wnd.chrome.tabs.get(tabId, $entry(function(tab) {
			handler.@com.google.gwt.chrome.tabs.TabCallback::onResult(Lcom/google/gwt/chrome/tabs/Tab;)(tab);
		}));
	}-*/;
	/**
	 * Gets the tab that this script call is being made from. May be undefined if called from a non-tab context (for example: a background page or popup view).
	 * @param handler The callback parameter
	 */
	public final native void getCurrent(TabCallback handler)/*-{
		$wnd.chrome.tabs.getCurrent($entry(function(tab) {
			handler.@com.google.gwt.chrome.tabs.TabCallback::onResult(Lcom/google/gwt/chrome/tabs/Tab;)(tab);
		}));
	}-*/;
	
	/**
	 * Creates a new tab. <br/>
	 * <p>Note:<br/>This function can be used without requesting the <b>'tabs'</b> permission
	 * in the manifest.</p>
	 */
	public final native void create(CreateProperties props, TabCallback handler)/*-{
		var clb = $entry(function(item) {
			handler.@com.google.gwt.chrome.tabs.TabCallback::onResult(Lcom/google/gwt/chrome/tabs/Tab;)(item);
		});
		$wnd.chrome.tabs.create(props, clb);
	}-*/;
	/**
	 * Duplicates a tab.
	 * @param tabId The ID of the tab which is to be duplicated.
	 * @param handler The callback parameter
	 */
	public final native void duplicate(int tabId, TabCallback handler)/*-{
		$wnd.chrome.tabs.duplicate(tabId, $entry(function(tab) {
			handler.@com.google.gwt.chrome.tabs.TabCallback::onResult(Lcom/google/gwt/chrome/tabs/Tab;)(tab);
		}));
	}-*/;
	/**
	 * Duplicates a tab.
	 * @param tabId The ID of the tab which is to be duplicated.
	 * @param handler The callback parameter
	 */
	public final native void query(TabQuery queryInfo, TabsCallback handler)/*-{
		$wnd.chrome.tabs.query(queryInfo, $entry(function(result) {
			handler.@com.google.gwt.chrome.tabs.TabsCallback::onResult(Lcom/google/gwt/core/client/JsArray;)(result);
		}));
	}-*/;
	/**
	 * Duplicates a tab.
	 * @param tabId The ID of the tab which is to be duplicated.
	 * @param handler The callback parameter
	 */
	public final native void update(int tabId, TabQuery updateProperties, TabCallback handler)/*-{
		$wnd.chrome.tabs.update(queryInfo, $entry(function(tab) {
			handler.@com.google.gwt.chrome.tabs.TabCallback::onResult(Lcom/google/gwt/chrome/tabs/Tab;)(tab);
		}));
	}-*/;
	
	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	public static final native boolean isSupported()/*-{
		return !!($wnd.chrome.tabs);
	}-*/;
}
