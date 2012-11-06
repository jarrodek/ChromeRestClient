package org.rest.client.storage.store;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.storage.websql.StatusCodeRow;
import org.rest.client.storage.websql.StatusCodesService;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;

public class StatusesStoreWebSql extends WebSqlAdapter<Integer, StatusCodeRow> {
	StatusCodesService service = GWT.create(StatusCodesService.class);
	
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
	 * This database do not support this method.
	 */
	@Override
	public void keys(StoreResultCallback<List<Integer>> callback) {
		callback.onError(null);
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void put(StatusCodeRow obj, Integer key,
			StoreResultCallback<Integer> callback) {
		callback.onError(null);
	}

	@Override
	public void getByKey(Integer key,
			final StoreResultCallback<StatusCodeRow> callback) {
		service.getCode(key,
				new ListCallback<StatusCodeRow>() {

					@Override
					public void onFailure(DataServiceException error) {
						callback.onError(error);
					}

					@Override
					public void onSuccess(List<StatusCodeRow> result) {
						if (result.size() > 0) {
							callback.onSuccess(result.get(0));
						} else {
							callback.onSuccess(null);
						}
					}
				});
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void exists(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void all(StoreResultCallback<Map<Integer, StatusCodeRow>> callback) {
		callback.onError(null);
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void remove(Integer key, StoreResultCallback<Boolean> callback) {
		callback.onError(null);
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void countAll(StoreResultCallback<Integer> callback) {
		callback.onError(null);
	}

	/**
	 * This database do not support this method.
	 */
	@Override
	public void query(String query, String index,
			StoreResultCallback<Map<Integer, StatusCodeRow>> callback) {
		callback.onError(null);
	}
	/**
	 * Insert many status codes in one transaction 
	 * @param codeList
	 * @param callback
	 */
	public void putAll(Collection<StatusCodeRow> codeList,
			final StoreResultCallback<List<Integer>> callback) {
		service.insertCodes(codeList, new RowIdListCallback() {
			
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
}
