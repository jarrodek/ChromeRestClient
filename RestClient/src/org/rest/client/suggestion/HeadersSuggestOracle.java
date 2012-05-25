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
	
	public HeadersSuggestOracle(HeadersStore store){
		this.store = store;
	}
	
	@Override
	public boolean isDisplayStringHTML() {
		return true;
	}
	
	@Override
	void makeQuery(final Request request, final Callback callback) {
		requestInProgress = true;
		store.open(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				final String query = request.getQuery();
				store.query(query, HeadersStore.HEADER_INDEX, new StoreResultCallback<Map<Long,HeadersObject>>() {
					@Override
					public void onSuccess(Map<Long, HeadersObject> result) {
						requestInProgress = false;
						
						
						List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
						Iterator<Entry<Long, HeadersObject>> it = result.entrySet().iterator();
						while (it.hasNext()) {
							Entry<Long, HeadersObject> item = it.next();
							String headerName = item.getValue().getHeader();
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
			
			@Override
			public void onError(Throwable e) {
				requestInProgress = false;
				Log.error("HeadersSuggestOracle - databaseService open error:", e);
			}
		});
		
		
	}

}
