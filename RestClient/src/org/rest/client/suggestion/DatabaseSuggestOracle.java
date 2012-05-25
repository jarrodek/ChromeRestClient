package org.rest.client.suggestion;

import com.google.gwt.user.client.ui.SuggestOracle;

/**
 * Basic class to extend via various databases oracles
 * 
 * @author Paweł Psztyć
 * 
 */
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
	 * The most recent response from the DB.
	 */
	protected DatabaseResponse recentDatabaseResult = null;
	/**
	 * Number of suggestions to request from the DB.
	 */
	protected static int numberOfDatabaseSuggestions = 25;

	/**
	 * Set maximum number of suggestions displayed at once.
	 * 
	 * @param suggestionsNumber
	 */
	public void setNumberOfSuggestions(int suggestionsNumber) {
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
		
		if(recentClientRequest == null){
			callback.onSuggestionsReady(null, null);
			return;
		}
		
		final String mostRecentQuery = recentClientRequest.getQuery();

		// check if there is earlier search result
		if (recentDatabaseResult != null) {
			// if current query is equal to latest query do not perform new
			// search, just display latest results
			// TODO: try to give some expire time to latest request. Eg: 1-2
			// seconds to be sure nothing has changed since then.
			if (mostRecentQuery.equals(recentDatabaseResult.getQuery())) {
				Response resp = new Response(recentDatabaseResult.filter(
						recentClientRequest.getQuery(),
						recentClientRequest.getLimit()));
				callback.onSuggestionsReady(recentClientRequest, resp);

				//
				// If latest request has completed and current query contains
				// latest query (from starting) just filter latest results and
				// display it
				//
			} else if (recentDatabaseResult.isComplete()
					&& mostRecentQuery.startsWith(recentDatabaseResult
							.getQuery())) {
				Response resp = new Response(recentDatabaseResult.filter(
						recentClientRequest.getQuery(),
						recentClientRequest.getLimit()));
				callback.onSuggestionsReady(recentClientRequest, resp);
			} else {
				//make query to DB
				makeQuery(recentClientRequest, callback);
			}
		} else {
			//make query to DB
			makeQuery(recentClientRequest, callback);
		}
	}
	
	/**
	 * Perform search in database.
	 * @param request
	 * @param callback
	 */
	abstract void makeQuery(final Request request, final Callback callback);
}
