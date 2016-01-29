package org.rest.client.suggestion;

import java.util.ArrayList;

import org.rest.client.jso.UrlRow;
import org.rest.client.log.Log;
import org.rest.client.storage.store.UrlHistoryStore;
import org.rest.client.storage.store.UrlHistoryStore.StoreResultsCallback;

import com.google.gwt.chrome.history.History;
import com.google.gwt.chrome.history.HistoryItem;
import com.google.gwt.chrome.history.HistorySearchCallback;
import com.google.gwt.chrome.history.Query;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JsArray;

public class UrlsSuggestOracle extends DatabaseSuggestOracle {

	/**
	 * Allow to perform query
	 */
	private boolean allowQuery = true;
	private boolean databaseQueryEnd = true;
	private boolean chromeQueryEnd = true;
	ArrayList<UrlSuggestion> _suggestions = new ArrayList<UrlSuggestion>();

	@Override
	public boolean isDisplayStringHTML() {
		return true;
	}

	/**
	 * Sets if query can be performed.
	 * 
	 * @param allowQuery
	 *            true if oracle should perform an query
	 */
	public void setAllowQuery(boolean allowQuery) {
		this.allowQuery = allowQuery;
	}

	/**
	 * 
	 * @return true if oracle can perform an query
	 */
	public boolean isAllowQuery() {
		return allowQuery;
	}

	public UrlsSuggestOracle() {
		
	}

	/**
	 * Make Query to database
	 * 
	 * @param request
	 *            The request object.
	 * @param callback
	 *            The callback to call when the request returns.
	 */
	@Override
	void makeQuery(final Request request, final Callback callback) {
		if (!allowQuery) {
			_suggestions.clear();
			recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(
					request, numberOfDatabaseSuggestions, _suggestions);
			returnSuggestions(callback);
			return;
		}
		requestInProgress = true;
		databaseQueryEnd = false;
		chromeQueryEnd = false;
		_suggestions = new ArrayList<UrlSuggestion>();

		final String query = request.getQuery();
		UrlHistoryStore.query(query, new StoreResultsCallback() {
			@Override
			public void onSuccess(JsArray<UrlRow> result) {
				requestInProgress = false;
				databaseQueryEnd = true;
				if(result != null){
					String lowerQuery = query.toLowerCase();
					int size = result.length();
					for(int i=0; i<size; i++){
						UrlRow row = result.get(i);
						String url = row.getUrl();
						if(url == null){
							continue;
						}
						if(!url.toLowerCase().startsWith(lowerQuery)){
							continue;
						}
						UrlSuggestion s = new UrlSuggestion(url, false);
						_suggestions.add(s);
					}
				}
				if(chromeQueryEnd){
					recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
							numberOfDatabaseSuggestions, _suggestions);
					UrlsSuggestOracle.this.returnSuggestions(callback);
				}
			}
			@Override
			public void onError(Throwable e) {
				requestInProgress = false;
				databaseQueryEnd = true;
				Log.error("UrlsSuggestOracle - databaseService open error:", e);
			}
		});
		
		History h = GWT.create(History.class);
		if(h.isSupported()){
			Query _q = Query.create(query);
			_q.setMaxResults(numberOfDatabaseSuggestions);
			h.search(_q, new HistorySearchCallback() {
				@Override
				public void onResult(JsArray<HistoryItem> found) {
					chromeQueryEnd = true;
					if(found != null){
						int cnt = found.length();
						for(int i = 0; i<cnt; i++){
							String url = found.get(i).getUrl();
							if(url == null || !url.contains("://")) continue;
							UrlSuggestion s = new UrlSuggestion(url, true);
							_suggestions.add(s);
						}
					}
					if(databaseQueryEnd){
						recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
								numberOfDatabaseSuggestions, _suggestions);
						UrlsSuggestOracle.this.returnSuggestions(callback);
					}
				}
			});
		} else {
			chromeQueryEnd = true;
			UrlsSuggestOracle.this.returnSuggestions(callback);
		}
	}

}
