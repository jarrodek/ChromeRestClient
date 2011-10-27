package com.restclient.client.storage;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.user.client.ui.SuggestOracle;
import com.restclient.client.RestApp;
import com.restclient.client.storage.oracle.DatabaseHeadersResponse;
import com.restclient.client.storage.oracle.DatabaseResponse;
import com.restclient.client.storage.oracle.DatabaseUrlResponse;
import com.restclient.client.storage.oracle.HeaderSuggestion;
import com.restclient.client.storage.oracle.UrlSuggestion;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Local database suggestion oracle.
 * 
 * @author jarrod
 * 
 */
public class DatabaseSuggestOracle extends SuggestOracle {
	/**
	 * The most recent request made by the client.
	 */
	private Request recentClientRequest = null;
	/**
	 * Is there a request in progress
	 */
	private boolean requestInProgress = false;
	/**
	 * The most recent response from the server.
	 */
	private DatabaseResponse recentDatabaseResult = null;
	/**
	 * Number of suggestions to request from the server. Using 75 lets you test
	 * the logic that uses the isComplete method. query
	 */
	private static final int numberOfDatabaseSuggestions = 75;
	/**
	 * Database service.
	 */
	protected final Object databaseService;
	/**
	 * Database query type
	 */
	private String dataType;

	/**
	 * Local database suggestion oracle.
	 * @param urlsService 
	 * @param requestType 
	 */
	public DatabaseSuggestOracle(Object urlsService, String requestType) {
		databaseService = urlsService;
		dataType = requestType;
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
	private void returnSuggestions(Callback callback) {
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

	/**
	 * Make Query to database
	 * 
	 * @param request
	 *            The request object.
	 * @param callback
	 *            The callback to call when the request returns.
	 */
	private void makeQuery(final Request request, final Callback callback) {
		requestInProgress = true;

		if (dataType.equals("URLindex")) {
			queryUrls(request, callback);
		} else if (dataType.equals("HeadersNames")) {
			queryHeaders(request, callback);
		}

	}

	private void queryHeaders(final Request request, final Callback callback) {
		String query = request.getQuery();
		query = query + "%";

		((HeadersService) databaseService).getNames(query,
				new ListCallback<HeaderRow>() {

					@Override
					public void onFailure(DataServiceException error) {
						requestInProgress = false;
					}

					@Override
					public void onSuccess(List<HeaderRow> result) {
						requestInProgress = false;
						List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
						Iterator<HeaderRow> it = result.iterator();
						while (it.hasNext()) {
							HeaderRow item = it.next();
							HeaderSuggestion s = new HeaderSuggestion(item
									.getName());
							suggestions.add(s);
						}
						recentDatabaseResult = new DatabaseHeadersResponse(
								request, numberOfDatabaseSuggestions,
								suggestions);
						DatabaseSuggestOracle.this.returnSuggestions(callback);
					}
				});

	}

	private void queryUrls(final Request request, final Callback callback) {
		String query = request.getQuery();
		query = "%" + query + "%";

		((UrlsService) databaseService).getUrls(query,
				new ListCallback<UrlRow>() {
					@Override
					public void onFailure(DataServiceException error) {
						requestInProgress = false;
						if( RestApp.isDebug() ){
							Log.error(
									"DatabaseSuggestOracle - databaseService error:",
									error);
						}
					}

					@Override
					public void onSuccess(List<UrlRow> result) {
						requestInProgress = false;
						List<UrlSuggestion> suggestions = new ArrayList<UrlSuggestion>();
						Iterator<UrlRow> it = result.iterator();
						while (it.hasNext()) {
							UrlRow item = it.next();
							UrlSuggestion s = new UrlSuggestion(item.getUrl());
							suggestions.add(s);
						}
						recentDatabaseResult = new DatabaseUrlResponse(request,
								numberOfDatabaseSuggestions, suggestions);
						DatabaseSuggestOracle.this.returnSuggestions(callback);
					}
				});
	}

}
