package com.kalicinscy.web.restclient.client.storage.oracle;

import com.google.gwt.user.client.ui.SuggestOracle.Request;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to hold a response from database urls request.
 */
public class DatabaseHeadersResponse implements DatabaseResponse {

	/**
	 * Request made by the SuggestBox.
	 */
	private Request request = null;
	/**
	 * The number of suggestions the server was asked for
	 */
	private int databaseQueryLimit = 0;
	/**
	 * Suggestions returned by the server in response to the request.
	 */
	private List<HeaderSuggestion> suggestions = null;

	public DatabaseHeadersResponse(Request req, int dbSuggestionsLimit,
			List<HeaderSuggestion> suggestions) {
		this.request = req;
		this.databaseQueryLimit = dbSuggestionsLimit;
		this.suggestions = suggestions;
	}

	@Override
	public String getQuery() {
		return request.getQuery();
	}

	@Override
	public boolean isComplete() {
		return suggestions.size() <= databaseQueryLimit;
	}

	@Override
	public List<Suggestion> filter(String query, int limit) {
		query = query.toLowerCase();
		List<Suggestion> newSuggestions = new ArrayList<Suggestion>(limit);
		int i = 0, s = suggestions.size();
		while (i < s && !suggestions.get(i).getDisplayString().toLowerCase().contains(query)) {
			++i;
		}
		while (i < s && newSuggestions.size() < limit
				&& suggestions.get(i).getDisplayString().toLowerCase().contains(query)) {
			newSuggestions.add(suggestions.get(i));
			++i;
		}
		return newSuggestions;
	}
}
