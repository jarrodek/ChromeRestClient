package org.rest.client.storage.store;

import java.util.Date;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.storage.websql.HistoryService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class HistoryRequestStoreWebSql extends WebSqlAdapter<Integer, HistoryObject> {
	
	HistoryService service = GWT.create(HistoryService.class);
	
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
	/**
	 * Insert Request data into history table.
	 * 
	 * @param obj The data to insert
	 * @param key - <b>NULL</b> (do nothing here)
	 * @param callback The callback to call after insert.
	 */
	@Override
	public void put(HistoryObject obj, Integer key,
			final StoreResultCallback<Integer> callback) {
		service.insertRequest(obj, new RowIdListCallback() {
			
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

	@Override
	public void getByKey(Integer key,
			StoreResultCallback<HistoryObject> callback) {
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
	public void all(StoreResultCallback<Map<Integer, HistoryObject>> callback) {
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
			StoreResultCallback<Map<Integer, HistoryObject>> callback) {
		callback.onError(null);
	}
	
	public void deleteHistory(final StoreResultCallback<Boolean> callback){
		service.truncate(new VoidCallback() {
			
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
	 * Get from database data only for history list. It's include: database ID, URL and method field.
	 * @param callback
	 */
	public void historyList(final StoreResultCallback<List<HistoryObject>> callback){
		service.getDataForHistoryView(new ListCallback<HistoryObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HistoryObject> result) {
				callback.onSuccess(result);
			}
		});
	}
	public void getHistoryItem(int id, final StoreResultCallback<HistoryObject> callback){
		service.getHistoryItem(id, new ListCallback<HistoryObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HistoryObject> result) {
				if(result == null || result.isEmpty()){
					callback.onSuccess(null);
					return;
				}
				callback.onSuccess(result.get(0));
			}
		});
	}
	public void getHistoryItem(String url, String method, final StoreResultCallback<List<HistoryObject>> callback){
		service.getHistoryItems(url, method, new ListCallback<HistoryObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HistoryObject> result) {
				callback.onSuccess(result);
			}
		});
	}
	
	public void updateHistoryItemTime(int rowId, Date updateTime, final StoreResultCallback<Boolean> callback){
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
}
