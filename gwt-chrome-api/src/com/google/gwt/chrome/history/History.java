package com.google.gwt.chrome.history;

import com.google.gwt.core.client.JsArray;

/**
 * Use the chrome.history API to interact with the browser's record of visited
 * pages. You can add, remove, and query for URLs in the browser's history. To
 * override the history page with your own version, see {@link https://developer.chrome.com/extensions/override} Override Pages.
 * 
 * @author Paweł Psztyć
 * 
 */
public class History {

	public interface HistoryVisitsHandler {
		void onVisits(JsArray<VisitItem> visits);
	}

	public interface HistoryHandler {
		void onDone();
	}

	public interface HistoryItemHandler {
		void onHistoryItem(HistoryItem item);
	}

	public interface HistoryVisitsRemovedHandler {
		void onHistoryRemoved(HistoryRemoved removed);
	}

	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	public static final native boolean isSupported()/*-{
		return !!($wnd.chrome.history);
	}-*/;

	/**
	 * Searches the history for the last visit time of each page matching the
	 * query.
	 * 
	 * @param query
	 * @param callback
	 */
	public final native void search(Query query, HistorySearchCallback handler) /*-{
		var clb = $entry(function(items) {
			handler.@com.google.gwt.chrome.history.HistorySearchCallback::onResult(Lcom/google/gwt/core/client/JsArray;)(items);
		});
		$wnd.chrome.history.search(query, clb);
	}-*/;

	/**
	 * Retrieves information about visits to a URL.
	 * 
	 * @param details
	 *            Query details
	 * @param handler
	 *            The callback parameter
	 */
	public final native void getVisits(HistoryQueryDetails details, HistoryVisitsHandler handler) /*-{
		$wnd.chrome.history
				.getVisits(
						details,
						$entry(function(items) {
							handler.@com.google.gwt.chrome.history.History.HistoryVisitsHandler::onVisits(Lcom/google/gwt/core/client/JsArray;)(items);
						}));
	}-*/;

	/**
	 * Adds a URL to the history at the current time with a transition type of
	 * "link".
	 * 
	 * @param details
	 *            Query details
	 * @param handler
	 *            The callback parameter
	 */
	public final native void addUrl(HistoryQueryDetails details, HistoryHandler handler) /*-{
		$wnd.chrome.history
				.addUrl(
						details,
						$entry(function() {
							handler.@com.google.gwt.chrome.history.History.HistoryHandler::onDone()();
						}));
	}-*/;

	/**
	 * Removes all occurrences of the given URL from the history.
	 * 
	 * @param details
	 *            Query details
	 * @param handler
	 *            The callback parameter
	 */
	public final native void deleteUrl(HistoryQueryDetails details, HistoryHandler handler) /*-{
		$wnd.chrome.history
				.deleteUrl(
						details,
						$entry(function() {
							handler.@com.google.gwt.chrome.history.History.HistoryHandler::onDone()();
						}));
	}-*/;

	/**
	 * Removes all items within the specified date range from the history. Pages
	 * will not be removed from the history unless all visits fall within the
	 * range.
	 * 
	 * @param range
	 *            Query object
	 * @param handler
	 *            The callback parameter
	 */
	public final native void deleteRange(HistoryDeleteRange range, HistoryHandler handler) /*-{
		$wnd.chrome.history
				.deleteRange(
						range,
						$entry(function() {
							handler.@com.google.gwt.chrome.history.History.HistoryHandler::onDone()();
						}));
	}-*/;

	/**
	 * Deletes all items from the history.
	 * 
	 * @param handler
	 *            The callback parameter
	 */
	public final native void deleteAll(HistoryHandler handler) /*-{
		$wnd.chrome.history
				.deleteAll($entry(function() {
					handler.@com.google.gwt.chrome.history.History.HistoryHandler::onDone()();
				}));
	}-*/;

	/**
	 * Fired when a URL is visited, providing the HistoryItem data for that URL.
	 * This event fires before the page has loaded.
	 */
	public final native void addVisitedChangeHandler(HistoryItemHandler handler) /*-{
		$wnd.chrome.history.onVisited
				.addListener($entry(function(result) {
					handler.@com.google.gwt.chrome.history.History.HistoryItemHandler::onHistoryItem(Lcom/google/gwt/chrome/history/HistoryItem;)(result);
				}));
	}-*/;

	/**
	 * Fired when one or more URLs are removed from the history service. When
	 * all visits have been removed the URL is purged from history.
	 */
	public final native void addVisitRemoved(HistoryVisitsRemovedHandler handler) /*-{
		$wnd.chrome.history.onVisitRemoved
				.addListener($entry(function(removed) {
					handler.@com.google.gwt.chrome.history.History.HistoryVisitsRemovedHandler::onHistoryRemoved(Lcom/google/gwt/chrome/history/HistoryRemoved;)(removed);
				}));
	}-*/;
}
