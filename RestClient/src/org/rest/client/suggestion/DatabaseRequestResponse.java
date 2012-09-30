package org.rest.client.suggestion;

import com.google.gwt.user.client.ui.SuggestOracle.Request;
import com.google.gwt.user.client.ui.SuggestOracle.Suggestion;

import java.util.ArrayList;
import java.util.List;

/**
 * Class to hold a response from database urls request.
 */
public class DatabaseRequestResponse<K extends Suggestion> implements DatabaseResponse {

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
	private List<K> suggestions = null;

	public DatabaseRequestResponse(Request req, int dbSuggestionsLimit,
			List<K> suggestions) {
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
		return suggestions.size() < databaseQueryLimit;
	}

	@Override
	public List<Suggestion> filter(String query, int limit) {
		query = query.toLowerCase();
		List<Suggestion> newSuggestions = new ArrayList<Suggestion>(limit);
		int size = suggestions.size();
		for(int i=0; i< size; i++){
			if(i==limit){
				break;
			}
			newSuggestions.add(suggestions.get(i));
		}
		
//		int curr = 0, all = suggestions.size();
//		for(int i=0; i < all; i++){
//			if(curr >= limit){
//				break;
//			}
//			if(suggestions.get(i).getDisplayString().toLowerCase().startsWith(query)){
//				curr++;
//				newSuggestions.add(suggestions.get(i));
//			}
//		}
		return newSuggestions;
	}
}
