package org.rest.client.storage.store;

import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.store.objects.HistoryObject;
import org.rest.client.storage.websql.HistoryService;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.ScalarCallback;
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
			final StoreResultCallback<HistoryObject> callback) {
		service.getHistoryItem(key, new ListCallback<HistoryObject>() {
			
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
	public void all(final StoreResultCallback<Map<Integer, HistoryObject>> callback) {
		try{
		service.getAll(new ListCallback<HistoryObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<HistoryObject> result) {
				Iterator<HistoryObject> it = result.iterator();
				HashMap<Integer, HistoryObject> all = new HashMap<Integer, HistoryObject>();
				while(it.hasNext()){
					HistoryObject next = it.next();
					all.put(next.getId(), next);
				}
				callback.onSuccess(all);
			}
		});
		} catch(Exception e){
			callback.onError(e);
		}
	}
	/**
	 * This type of query is not available for this table.
	 */
	@Override
	public void remove(Integer key, final StoreResultCallback<Boolean> callback) {
		if(key == null){
			String msg = "Try to remove a history item without defining a key.";
			Log.error(msg);
			callback.onError(new Exception(msg));
			return;
		}
		service.remove(key.intValue(), new VoidCallback() {
			
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
	 * This type of query is not available for this table.
	 */
	@Override
	public void countAll(final StoreResultCallback<Integer> callback) {
		service.count(new ScalarCallback<Integer>() {
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(Integer result) {
				callback.onSuccess(result);
			}
		});
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
	public void historyList(String query, int limit, int offset, final StoreResultCallback<List<HistoryObject>> callback){
		if(query == null || query.isEmpty()){
			service.getDataForHistoryView(limit, offset, new ListCallback<HistoryObject>() {
				
				@Override
				public void onFailure(DataServiceException error) {
					callback.onError(error);
				}
				
				@Override
				public void onSuccess(List<HistoryObject> result) {
					callback.onSuccess(result);
				}
			});
			return;
		}
		service.getDataForHistoryView(query, limit, offset, new ListCallback<HistoryObject>() {
			
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
	
	
	public void historySize(String query, final StoreResultCallback<Integer> callback){
		if(query == null || query.isEmpty()){
			countAll(callback);
			return;
		}
		service.count(query, new ScalarCallback<Integer>() {
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(Integer result) {
				callback.onSuccess(result);
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
