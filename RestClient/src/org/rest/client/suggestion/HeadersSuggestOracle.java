package org.rest.client.suggestion;

import java.util.ArrayList;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.HeadersStore;
import org.rest.client.storage.store.objects.HeadersObject;

import com.allen_sauer.gwt.log.client.Log;

public class HeadersSuggestOracle extends DatabaseSuggestOracle {
	private final HeadersStore store;
	private final String headerType;
	
	/**
	 * 
	 * @param store DataStore 
	 * @param headerType Either "request" or "response"
	 */
	public HeadersSuggestOracle(HeadersStore store, String headerType){
		this.store = store;
		this.headerType = headerType;
	}
	
	@Override
	public boolean isDisplayStringHTML() {
		return true;
	}
	
	@Override
	void makeQuery(final Request request, final Callback callback) {
		requestInProgress = true;
		if(store.isOpened()){
			runQuery(request, callback);
		} else {
			store.open(new StoreResultCallback<Boolean>() {
				@Override
				public void onSuccess(Boolean result) {
					runQuery(request, callback);
				}
				
				@Override
				public void onError(Throwable e) {
					requestInProgress = false;
					Log.error("HeadersSuggestOracle - databaseService open error:", e);
				}
			});
		}
	}
	
	
	private void runQuery(final Request request, final Callback callback){
		final String query = request.getQuery();
		store.query(query, HeadersStore.HEADER_INDEX, new StoreResultCallback<Map<Long,HeadersObject>>() {
			@Override
			public void onSuccess(Map<Long, HeadersObject> result) {
//				Log.debug("Headers response for query: " + query + " has "+result.size()+" items");
				
				String lowerQuery = query.toLowerCase();
				
				requestInProgress = false;
				List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
				Iterator<Entry<Long, HeadersObject>> it = result.entrySet().iterator();
				while (it.hasNext()) {
					Entry<Long, HeadersObject> item = it.next();
					if(headerType != null && !item.getValue().getType().equals(headerType)){
						continue;
					}
					String headerName = item.getValue().getHeader();
					if(headerName == null){
						continue;
					}
					if(!headerName.toLowerCase().startsWith(lowerQuery)){
						continue;
					}
					
//					Log.debug(headerName);
					HeaderSuggestion s = new HeaderSuggestion(headerName);
					suggestions.add(s);
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
