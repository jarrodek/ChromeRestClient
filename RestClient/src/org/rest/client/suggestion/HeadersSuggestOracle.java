package org.rest.client.suggestion;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.jso.HeaderRow;
import org.rest.client.log.Log;
import org.rest.client.storage.store.HeadersStoreWebSql;

import com.google.gwt.core.client.JsArray;

public class HeadersSuggestOracle extends DatabaseSuggestOracle {
	private final HeadersStoreWebSql store;
	private final String headerType;
	
	/**
	 * 
	 * @param store DataStore 
	 * @param headerType Either "request" or "response"
	 */
	public HeadersSuggestOracle(HeadersStoreWebSql store, String headerType){
		this.store = store;
		this.headerType = headerType;
//		Log.info("HeadersSuggestOracle::construct for type " + headerType);
	}
	
	@Override
	public boolean isDisplayStringHTML() {
		return true;
	}
	
	@Override
	void makeQuery(final Request request, final Callback callback) {
		requestInProgress = true;
//		Log.info("HeadersSuggestOracle::makeQuery -> " + request.getQuery());
		runQuery(request, callback);
	}
	
	
	private void runQuery(final Request request, final Callback callback){
		final String query = request.getQuery();
		store.getHeaders("%" + query + "%", headerType, new HeadersStoreWebSql.StoreResultsCallback() {
			
			@Override
			public void onSuccess(JsArray<HeaderRow> result) {
				String lowerQuery = query.toLowerCase();
				
				requestInProgress = false;
				List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
				if(result != null) {
					for (int i = 0; i < result.length(); i++) {
						HeaderRow row = result.get(i);
						String headerName = row.getName();
						if(headerName == null){
							continue;
						}
						if(!headerName.toLowerCase().startsWith(lowerQuery)){
							continue;
						}
						HeaderSuggestion s = new HeaderSuggestion(headerName);
						suggestions.add(s);
					}
				}
				recentDatabaseResult = new DatabaseRequestResponse<HeaderSuggestion>(request,
						numberOfDatabaseSuggestions, suggestions);
				HeadersSuggestOracle.this.returnSuggestions(callback);
			}
			
			@Override
			public void onError(Throwable e) {
				requestInProgress = false;
				Log.error("HeadersSuggestOracle - databaseService query error:", e);
			}
		});
		
	}
	
}
