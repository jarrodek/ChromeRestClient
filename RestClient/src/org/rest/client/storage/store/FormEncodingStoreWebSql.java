package org.rest.client.storage.store;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.store.objects.FormEncodingObject;
import org.rest.client.storage.websql.FormEncodingService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class FormEncodingStoreWebSql extends WebSqlAdapter<Integer, FormEncodingObject> {
	FormEncodingService service = GWT.create(FormEncodingService.class);

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
	 * This store do not support this type of query.
	 */
	@Override
	public void keys(StoreResultCallback<List<Integer>> callback) {
		callback.onError(null);
	}

	/**
	 * Put FormEncoding value into store.
	 * @param obj Object to put (will take {@link FormEncodingObject#getEncoding()} value only) 
	 * @param key Nothing. Should be NULL
	 * @param callback
	 */
	@Override
	public void put(FormEncodingObject obj, final Integer key,
			final StoreResultCallback<Integer> callback) {
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
	 * This store do not support this type of query.
	 */
	@Override
	public void getByKey(Integer key,
			StoreResultCallback<FormEncodingObject> callback) {
		callback.onError(null);
	}
	/**
	 * This store do not support this type of query.
	 */
	@Override
	public void exists(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}

	/**
	 * Get all data from database
	 */
	@Override
	public void all(
			final StoreResultCallback<Map<Integer, FormEncodingObject>> callback) {
		service.getAll(new ListCallback<FormEncodingObject>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				callback.onError(error);
			}
			
			@Override
			public void onSuccess(List<FormEncodingObject> result) {
				HashMap<Integer, FormEncodingObject> map = new HashMap<Integer, FormEncodingObject>();
				for(FormEncodingObject o : result){
					map.put(Integer.parseInt(String.valueOf(o.getId())), o);
				}
				callback.onSuccess(map);
			}
		});
	}
	/**
	 * This store do not support this type of query.
	 */
	@Override
	public void remove(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}
	/**
	 * This store do not support this type of query.
	 */
	@Override
	public void countAll(StoreResultCallback<Integer> callback) {
		callback.onError(null);
	}
	/**
	 * This store do not support this type of query.
	 */
	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<Integer, FormEncodingObject>> callback) {
		callback.onError(null);
	}

}
