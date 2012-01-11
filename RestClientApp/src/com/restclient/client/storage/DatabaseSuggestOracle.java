package com.restclient.client.storage;

import com.google.gwt.user.client.ui.SuggestOracle;
import com.restclient.client.storage.oracle.DatabaseResponse;

public abstract class DatabaseSuggestOracle extends SuggestOracle {
	/**
	 * The most recent request made by the client.
	 */
	protected Request recentClientRequest = null;
	/**
	 * Is there a request in progress
	 */
	protected boolean requestInProgress = false;
	/**
	 * The most recent response from the server.
	 */
	protected DatabaseResponse recentDatabaseResult = null;
	/**
	 * Number of suggestions to request from the server. Using 75 lets you test
	 * the logic that uses the isComplete method. query
	 */
	protected static int numberOfDatabaseSuggestions = 75;
	
	public void setNumberOfSuggestions(int suggestionsNumber){
		numberOfDatabaseSuggestions = suggestionsNumber;
	}
	
	@Override
	public void requestSuggestions(final Request request,
			final Callback callback) {
		recentClientRequest = request;
		if (!requestInProgress) {
			returnSuggestions(callback);
		}
	}
	
	/**
	 * Return some suggestions to the SuggestBox. At this point we know that
	 * there is no call to the server currently in progress and we try to
	 * satisfy the request from the most recent results from the server before
	 * we call the server.
	 * 
	 * @param callback
	 *            The callback.
	 */
	void returnSuggestions(Callback callback) {
		final String mostRecentQuery = recentClientRequest.getQuery();

		if (recentDatabaseResult != null) {
			if (mostRecentQuery.equals(recentDatabaseResult.getQuery())) {
				Response resp = new Response(recentDatabaseResult.filter(
						recentClientRequest.getQuery(),
						recentClientRequest.getLimit()));
				callback.onSuggestionsReady(recentClientRequest, resp);
			} else if (recentDatabaseResult.isComplete()
					&& mostRecentQuery.startsWith(recentDatabaseResult
							.getQuery())) {
				Response resp = new Response(recentDatabaseResult.filter(
						recentClientRequest.getQuery(),
						recentClientRequest.getLimit()));
				callback.onSuggestionsReady(recentClientRequest, resp);
			} else {
				makeQuery(recentClientRequest, callback);
			}
		} else {
			makeQuery(recentClientRequest, callback);
		}
	}
	
	abstract void makeQuery(final Request request, final Callback callback);
}
