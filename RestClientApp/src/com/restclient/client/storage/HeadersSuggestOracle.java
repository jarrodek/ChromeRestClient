package com.restclient.client.storage;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.restclient.client.storage.oracle.DatabaseRequestResponse;
import com.restclient.client.storage.oracle.HeaderSuggestion;

/**
 * Local database suggestion oracle.
 * 
 * @author jarrod
 * 
 */
public class HeadersSuggestOracle extends DatabaseSuggestOracle {
	/**
	 * Database service.
	 */
	protected final HeadersService service;

	/**
	 * Local database suggestion oracle.
	 * 
	 * @param urlsService
	 * @param requestType
	 */
	public HeadersSuggestOracle(HeadersService urlsService) {
		service = urlsService;
	}

	@Override
	public boolean isDisplayStringHTML() {
		return true;
	}

	/**
	 * Make Query to database
	 * 
	 * @param request
	 *            The request object.
	 * @param callback
	 *            The callback to call when the request returns.
	 */
	void makeQuery(final Request request, final Callback callback) {
		requestInProgress = true;

		String query = request.getQuery();
		query = query + "%";

		service.getRequestNames(query, new ListCallback<HeaderRow>() {
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
					HeaderSuggestion s = new HeaderSuggestion(item.getName());
					suggestions.add(s);
				}
				recentDatabaseResult = new DatabaseRequestResponse<HeaderSuggestion>(request,
						numberOfDatabaseSuggestions, suggestions);
				HeadersSuggestOracle.this.returnSuggestions(callback);
			}
		});
	}

}
