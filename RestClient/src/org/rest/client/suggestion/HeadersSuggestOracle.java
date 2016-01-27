package org.rest.client.suggestion;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.jso.HeaderIdb;
import org.rest.client.jso.HeaderRow;
import org.rest.client.log.Log;
import org.rest.client.storage.store.HeadersIdb;
import org.rest.client.storage.store.HeadersStoreWebSql;

import com.google.gwt.core.client.JsArray;

public class HeadersSuggestOracle extends DatabaseSuggestOracle {
	private final HeadersStoreWebSql store;
	private final String headerType;

	/**
	 * 
	 * @param store
	 *            DataStore
	 * @param headerType
	 *            Either "request" or "response"
	 */
	public HeadersSuggestOracle(HeadersStoreWebSql store, String headerType) {
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
		runQuery(request, callback);
	}

	private void runQuery(final Request request, final Callback callback) {
		String query = request.getQuery();
		getHeadersIdb(query, new com.google.gwt.core.client.Callback<List<HeaderSuggestion>, Throwable>() {
			@Override
			public void onSuccess(List<HeaderSuggestion> suggestions) {
				requestInProgress = false;
				recentDatabaseResult = new DatabaseRequestResponse<HeaderSuggestion>(request,
						numberOfDatabaseSuggestions, suggestions);
				HeadersSuggestOracle.this.returnSuggestions(callback);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				requestInProgress = false;
				Log.error("HeadersSuggestOracle - databaseService query error:", reason);
			}
		});
	}

	private void getHeadersIdb(final String query, final com.google.gwt.core.client.Callback<List<HeaderSuggestion>, Throwable> callbackFn) {
		Log.debug("getHeadersIdb for ", query);
		HeadersIdb.getHeaders(query, headerType, new HeadersIdb.StoreResultsCallback() {
			@Override
			public void onSuccess(JsArray<HeaderIdb> result) {
				Log.debug("getHeadersIdb has ", result, query);
				
				String lowerQuery = query.toLowerCase();
				List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
				if (result != null) {
					for (int i = 0; i < result.length(); i++) {
						HeaderIdb row = result.get(i);
						String headerName = row.getKey();
						if (headerName == null) {
							continue;
						}
						if (!headerName.toLowerCase().startsWith(lowerQuery)) {
							continue;
						}
						HeaderSuggestion s = new HeaderSuggestion(headerName);
						suggestions.add(s);
					}
				}
				Log.debug("getHeadersIdb resulted with ", result);
				callbackFn.onSuccess(suggestions);
			}

			@Override
			public void onError(Throwable e) {
				store.getHeaders(query + "%", headerType, new HeadersStoreWebSql.StoreResultsCallback() {

					@Override
					public void onSuccess(JsArray<HeaderRow> result) {
						String lowerQuery = query.toLowerCase();
						List<HeaderSuggestion> suggestions = new ArrayList<HeaderSuggestion>();
						if (result != null) {
							for (int i = 0; i < result.length(); i++) {
								HeaderRow row = result.get(i);
								String headerName = row.getName();
								if (headerName == null) {
									continue;
								}
								if (!headerName.toLowerCase().startsWith(lowerQuery)) {
									continue;
								}
								HeaderSuggestion s = new HeaderSuggestion(headerName);
								suggestions.add(s);
							}
						}
						callbackFn.onSuccess(suggestions);
					}

					@Override
					public void onError(Throwable e) {
						Log.error("HeadersSuggestOracle - databaseService query error:", e);
						callbackFn.onFailure(e);
					}
				});
			}
		});
	}

}
