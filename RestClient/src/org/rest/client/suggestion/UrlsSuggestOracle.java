package org.rest.client.suggestion;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.chrome.History;
import org.rest.client.chrome.History.Query;
import org.rest.client.chrome.HistoryItem;
import org.rest.client.chrome.HistorySearchCallback;
import org.rest.client.chrome.JsArray;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.storage.websql.UrlRow;

import com.allen_sauer.gwt.log.client.Log;

public class UrlsSuggestOracle extends DatabaseSuggestOracle {

	/**
	 * Allow to perform query
	 */
	private boolean allowQuery = true;
	final private UrlHistoryStoreWebSql store;
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

	public UrlsSuggestOracle(UrlHistoryStoreWebSql store) {
		this.store = store;
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
		
		store.getByUrl("%" + query + "%", new StoreResultCallback<List<UrlRow>>() {
			
			@Override
			public void onSuccess(List<UrlRow> result) {
				requestInProgress = false;
				databaseQueryEnd = true;
				String lowerQuery = query.toLowerCase();
				for(UrlRow row : result){
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
				if(chromeQueryEnd){
					Log.debug("chromeQueryEnd");
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
		
		Query _q = Query.create(query);
		_q.setMaxResults(numberOfDatabaseSuggestions);
		
		History h = History.getHistoryIfSupported();
		if(h == null){ 
			// Use chrome message passing to background page
			RestClient.getClientFactory().getChromeMessagePassing().postMessage("history.search", _q.toJSON(), new com.google.gwt.core.client.Callback<String, Throwable>() {
				
				@Override
				public void onSuccess(String result) {
					JsArray<HistoryItem> found = HistoryItem.fromString(result);
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
				
				@Override
				public void onFailure(Throwable reason) {
					chromeQueryEnd = true;
				}
			});
		} else {
			// Call chrome API (compiled extension)
			Query q = Query.create(query);
			q.setMaxResults(numberOfDatabaseSuggestions);
			h.search(q, new HistorySearchCallback() {
				@Override
				public void onResult(JsArray<HistoryItem> found) {
					chromeQueryEnd = true;
					int cnt = found.length();
					for(int i = 0; i<cnt; i++){
						String url = found.get(i).getUrl();
						if(url == null || !url.contains("://")) continue;
						UrlSuggestion s = new UrlSuggestion(url, true);
						_suggestions.add(s);
					}
					if(databaseQueryEnd){
						recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
								numberOfDatabaseSuggestions, _suggestions);
						UrlsSuggestOracle.this.returnSuggestions(callback);
					}
				}
			});
		}
	}

}
