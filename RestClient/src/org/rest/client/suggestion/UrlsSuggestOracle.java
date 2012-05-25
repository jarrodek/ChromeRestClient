package org.rest.client.suggestion;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.Map;
import java.util.Map.Entry;

import org.rest.client.chrome.History;
import org.rest.client.chrome.History.Query;
import org.rest.client.chrome.HistoryItem;
import org.rest.client.chrome.HistorySearchCallback;
import org.rest.client.chrome.JsArray;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.UrlHistoryStore;
import org.rest.client.storage.store.objects.UrlHistoryObject;

import com.allen_sauer.gwt.log.client.Log;

public class UrlsSuggestOracle extends DatabaseSuggestOracle {

	/**
	 * Allow to perform query
	 */
	private boolean allowQuery = true;
	final private UrlHistoryStore store;
	private boolean databaseQueryEnd = true;
	private boolean chromeQueryEnd = true;
	ArrayList<UrlSuggestion> _suggestions = new ArrayList<UrlSuggestion>();

	@Override
	public boolean isDisplayStringHTML() {
		return false;
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

	public UrlsSuggestOracle(UrlHistoryStore store) {
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
		
		
		History h = History.getHistoryIfSupported();
		if(h == null){
			chromeQueryEnd = true;
		}
		
		
		// search in DB
		store.open(new StoreResultCallback<Boolean>() {

			@Override
			public void onSuccess(Boolean result) {
				if(result != null && result.booleanValue()){
					store.query(query, UrlHistoryStore.URL_INDEX, new StoreResultCallback<Map<Long,UrlHistoryObject>>() {
						@Override
						public void onSuccess(Map<Long, UrlHistoryObject> result) {
							requestInProgress = false;
							databaseQueryEnd = true;
							
							Iterator<Entry<Long, UrlHistoryObject>> it = result.entrySet().iterator();
							while(it.hasNext()){
								Entry<Long, UrlHistoryObject> entry = it.next();
								UrlHistoryObject value = entry.getValue();
								String url = value.getURL();
								UrlSuggestion s = new UrlSuggestion(url);
								_suggestions.add(s);
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
							//UrlsSuggestOracle.this.returnSuggestions(callback);
						}
					});
				}
			}

			@Override
			public void onError(Throwable e) {
				requestInProgress = false;
				databaseQueryEnd = true;
				Log.error("UrlsSuggestOracle - databaseService open error:", e);
				//UrlsSuggestOracle.this.returnSuggestions(callback);
			}
		});
		
		
		// Call chrome API.
		if(h != null){
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
						UrlSuggestion s = new UrlSuggestion(url);
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
