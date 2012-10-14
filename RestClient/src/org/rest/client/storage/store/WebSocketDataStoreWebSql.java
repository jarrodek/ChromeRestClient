package org.rest.client.storage.store;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.store.objects.WebSocketObject;
import org.rest.client.storage.websql.WebSocketDataService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class WebSocketDataStoreWebSql extends WebSqlAdapter<Integer, WebSocketObject> {
	
	WebSocketDataService service = GWT.create(WebSocketDataService.class);
	
	
	public WebSocketDataService getService(){
		return service;
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
	public void keys(StoreResultCallback<List<Integer>> callback) {
		callback.onError(null);
	}

	@Override
	public void put(WebSocketObject obj, final Integer key,
			final StoreResultCallback<Integer> callback) {
		if(key == null){
			service.insertData(obj, new RowIdListCallback() {
				
				@Override
				public void onFailure(DataServiceException error) {
					callback.onError(error);
				}
				
				@Override
				public void onSuccess(List<Integer> rowIds) {
					if(rowIds.size() == 0){
						callback.onError(null);
						return;
					}
					callback.onSuccess(rowIds.get(0));
				}
			});
		} else {
			service.updateData(obj, new VoidCallback() {
				
				@Override
				public void onFailure(DataServiceException error) {
					callback.onError(error);
				}

				@Override
				public void onSuccess() {
					callback.onSuccess(key);
				}
			});
		}
	}

	@Override
	public void getByKey(Integer key,
			final StoreResultCallback<WebSocketObject> callback) {
		service.getWebSocketData(key, new ListCallback<WebSocketObject>() {

			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}

			@Override
			public void onSuccess(List<WebSocketObject> result) {
				if(result.size() == 0){
					callback.onSuccess(null);
					return;
				}
				callback.onSuccess(result.get(0));
			}
		});
	}

	@Override
	public void exists(Integer key, final StoreResultCallback<Boolean> callback) {
		getByKey(key, new StoreResultCallback<WebSocketObject>() {
			@Override
			public void onSuccess(WebSocketObject result) {
				if(result != null)
					callback.onSuccess(true);
				else
					callback.onSuccess(false);
			}
			
			@Override
			public void onError(Throwable e) {
				callback.onError(e);
			}
		});
	}

	@Override
	public void all(final StoreResultCallback<Map<Integer, WebSocketObject>> callback) {
		
		service.getAllData(new ListCallback<WebSocketObject>() {
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<WebSocketObject> result) {
				Map<Integer, WebSocketObject> mapResult = new HashMap<Integer, WebSocketObject>();
				for(WebSocketObject item : result){
					mapResult.put(item.getId(), item);
				}
				callback.onSuccess(mapResult);
			}
		});
	}

	@Override
	public void remove(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}

	@Override
	public void countAll(StoreResultCallback<Long> callback) {
		callback.onError(null);
	}

	@Override
	public void query(String query, String index,
			final StoreResultCallback<Map<Integer, WebSocketObject>> callback) {
		service.queryByUrl(query, new ListCallback<WebSocketObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<WebSocketObject> result) {
				Map<Integer, WebSocketObject> mapResult = new HashMap<Integer, WebSocketObject>();
				for(WebSocketObject item : result){
					mapResult.put(item.getId(), item);
				}
				callback.onSuccess(mapResult);
			}
		});
	}

	

}
