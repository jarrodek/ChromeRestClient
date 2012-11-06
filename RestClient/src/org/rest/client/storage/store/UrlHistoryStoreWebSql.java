package org.rest.client.storage.store;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.websql.UrlRow;
import org.rest.client.storage.websql.UrlsService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class UrlHistoryStoreWebSql extends WebSqlAdapter<Integer, UrlRow> {
	UrlsService service = GWT.create(UrlsService.class);
	
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
	
	/**
	 * This database do not support keys listing.
	 */
	@Override
	public void keys(StoreResultCallback<List<Integer>> callback) {
		callback.onError(null);
	}
	
	
	@Override
	public void put(UrlRow obj, Integer key, final StoreResultCallback<Integer> callback) {
		service.put(obj, new RowIdListCallback() {
			
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
	public void getByKey(Integer key, StoreResultCallback<UrlRow> callback) {
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
	 * Gets all URLS objects from DB ordered by time
	 */
	@Override
	public void all(final StoreResultCallback<Map<Integer, UrlRow>> callback) {
		service.getUrls(new ListCallback<UrlRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<UrlRow> result) {
				Map<Integer, UrlRow> res = new HashMap<Integer, UrlRow>();
				for(UrlRow _r : result){
					res.put(_r.getId(), _r);
				}
				callback.onSuccess(res);
			}
		} );
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
	public void countAll(StoreResultCallback<Integer> callback) {
		callback.onError(null);
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<Integer, UrlRow>> callback) {
		callback.onError(null);
	}
	/**
	 * Update URL record for with last use time
	 * @param rowId ID of record
	 * @param updateTime Event time
	 * @param callback 
	 */
	public void updateUrlUseTime(int rowId, Date updateTime, final StoreResultCallback<Boolean> callback){
		service.updateTime(rowId, updateTime, new VoidCallback() {
			
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
	/**
	 * Get records by URL pattern
	 * @param query patter for "LIKE" query
	 * @param callback
	 */
	public void getByUrl(String query,
			final StoreResultCallback<List<UrlRow>> callback) {
		service.getUrls(query, new ListCallback<UrlRow>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<UrlRow> result) {
				callback.onSuccess(result);
			}
		});
	}
}
