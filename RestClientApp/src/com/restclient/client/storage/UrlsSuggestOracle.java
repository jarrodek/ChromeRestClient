package com.restclient.client.storage;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.restclient.client.RestApp;
import com.restclient.client.chrome.History;
import com.restclient.client.chrome.HistoryItem;
import com.restclient.client.chrome.HistorySearchCallback;
import com.restclient.client.chrome.History.Query;
import com.restclient.client.chrome.JsArray;
import com.restclient.client.storage.oracle.DatabaseRequestResponse;
import com.restclient.client.storage.oracle.UrlSuggestion;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;

/**
 * Local database suggestion oracle for URL.
 * 
 * @author jarrod
 * 
 */
public class UrlsSuggestOracle extends DatabaseSuggestOracle {
	/**
	 * Database service.
	 */
	protected final UrlsService service;
	/**
	 * Allow to perform query
	 */
	private boolean allowQuery = true;
	
	/**
	 * Sets if query can be performed.
	 * @param allowQuery true if oracle should perform an query
	 */
	public void setAllowQuery(boolean allowQuery){
		this.allowQuery = allowQuery;
	}
	/**
	 * 
	 * @return true if oracle can perform an query
	 */
	public boolean isAllowQuery(){
		return allowQuery;
	}
	
	/**
	 * Local database suggestion oracle.
	 * 
	 * @param urlsService
	 * @param requestType
	 */
	public UrlsSuggestOracle(UrlsService urlsService) {
		service = urlsService;
	}

	@Override
	public boolean isDisplayStringHTML() {
		return false;
	}
	
	private boolean isDatabaseQueryEnd = true;
	private boolean isChromeQueryEnd = true;
	List<UrlSuggestion> _suggestions = new ArrayList<UrlSuggestion>();
	
	
	/**
	 * Make Query to database
	 * 
	 * @param request
	 *            The request object.
	 * @param callback
	 *            The callback to call when the request returns.
	 */
	void makeQuery(final Request request, final Callback callback) {
		if(!allowQuery) {
			_suggestions.clear();
			recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
					numberOfDatabaseSuggestions, _suggestions);
			returnSuggestions(callback);
			return;
		}
		
		requestInProgress = true;
		isDatabaseQueryEnd = false;
		isChromeQueryEnd = false;
		_suggestions = new ArrayList<UrlSuggestion>();
		
		String query = request.getQuery();
		query = "%" + query + "%";
		
		//
		// call database
		//
		service.getUrls(query, new ListCallback<UrlRow>() {
			@Override
			public void onFailure(DataServiceException error) {
				requestInProgress = false;
				isDatabaseQueryEnd = true;
				if (RestApp.isDebug()) {
					Log.error("DatabaseSuggestOracle - databaseService error:",
							error);
				}
			}
			@Override
			public void onSuccess(List<UrlRow> result) {
				requestInProgress = false;
				isDatabaseQueryEnd = true;
				Iterator<UrlRow> it = result.iterator();
				while (it.hasNext()) {
					UrlRow item = it.next();
					UrlSuggestion s = new UrlSuggestion(item.getUrl());
					_suggestions.add(s);
				}
				if(isChromeQueryEnd){
					recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
							numberOfDatabaseSuggestions, _suggestions);
					UrlsSuggestOracle.this.returnSuggestions(callback);
				}
			}
		});
		//
		// Call chrome API.
		//
		History h = History.getHistoryIfSupported();
		if(h == null){
			isChromeQueryEnd = true;
			return;
		} else {
			Query q = Query.create(query);
			q.setMaxResults(numberOfDatabaseSuggestions);
			h.search(q, new HistorySearchCallback() {
				@Override
				public void onResult(JsArray<HistoryItem> found) {
					isChromeQueryEnd = true;
					int cnt = found.length();
					for(int i = 0; i<cnt; i++){
						String url = found.get(i).getUrl();
						if(url == null || !url.contains("://")) continue;
						UrlSuggestion s = new UrlSuggestion(url);
						_suggestions.add(s);
					}
					if(isDatabaseQueryEnd){
						recentDatabaseResult = new DatabaseRequestResponse<UrlSuggestion>(request,
								numberOfDatabaseSuggestions, _suggestions);
						UrlsSuggestOracle.this.returnSuggestions(callback);
					}
				}
			});
		}
	}
}
