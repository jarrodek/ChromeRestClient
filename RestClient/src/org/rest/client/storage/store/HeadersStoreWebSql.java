package org.rest.client.storage.store;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.websql.HeaderRow;
import org.rest.client.storage.websql.HeadersService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class HeadersStoreWebSql extends WebSqlAdapter<Integer, HeaderRow> {
	
	HeadersService service = GWT.create(HeadersService.class);
	
	/**
	 * This database do not support keys listing.
	 */
	@Override
	public void keys(StoreResultCallback<List<Integer>> callback) {
		callback.onError(null);
	}
	
	@Override
	public void open(final StoreResultCallback<Boolean> callback) {
		service.initTable(new VoidCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess() {
				callback.onSuccess(true);
			}
		});
	}
	
	@Override
	public void put(HeaderRow obj, Integer key, final StoreResultCallback<Integer> callback) {
		service.insertHeader(obj, new RowIdListCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<Integer> rowIds) {
				callback.onSuccess(rowIds.get(0));
			}
		});
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void getByKey(Integer key, StoreResultCallback<HeaderRow> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void exists(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void all(StoreResultCallback<Map<Integer, HeaderRow>> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void remove(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void countAll(StoreResultCallback<Long> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<Integer, HeaderRow>> callback) {
		callback.onError(null);
	}
	/**
	 * Insert headers list in one transaction. 
	 * @param list
	 * @param callback
	 */
	public void putAll(Collection<HeaderRow> list, final StoreResultCallback<List<Integer>> callback){
		service.insertHeaders(list, new RowIdListCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<Integer> rowIds) {
				callback.onSuccess(rowIds);
			}
		});
	}
	/**
	 * Find headers name by name. Wildcards are valid for "LIKE" query.
	 * @param name
	 * @param callback
	 */
	public void getHeadersNameByName(String name, final StoreResultCallback<List<HeaderRow>> callback){
		service.getNames(name, new ListCallback<HeaderRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);
			}
		});
	}
	/**
	 * Find headers name by name. Wildcards are valid for "LIKE" query.
	 * @param name
	 * @param callback
	 */
	public void getRequestHeadersNameByName(String name, final StoreResultCallback<List<HeaderRow>> callback){
		service.getRequestNames(name, new ListCallback<HeaderRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);
			}
		});
	}
	/**
	 * Returns all response headers for given names.
	 * @param headersList
	 */
	public void getResponseHeadersByName(List<String> headersList, final StoreResultCallback<List<HeaderRow>> callback){
		service.getResponseHeaders(headersList, new ListCallback<HeaderRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);	
			}
		});
	}
	/**
	 * Returns all request headers for given names.
	 * @param headersList
	 */
	public void getRequestHeadersByName(List<String> headersList, final StoreResultCallback<List<HeaderRow>> callback){
		service.getResponseHeaders(headersList, new ListCallback<HeaderRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);	
			}
		});
	}
	/**
	 * Get headers by its name (for "LIKE" query type) and given type (either request or response).
	 * @param name
	 * @param type
	 * @param callback
	 */
	public void getHeaders(String name, String type, final StoreResultCallback<List<HeaderRow>> callback){
		service.getHeader(name, type, new ListCallback<HeaderRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HeaderRow> result) {
				callback.onSuccess(result);
			}
		});
	}

	
}
