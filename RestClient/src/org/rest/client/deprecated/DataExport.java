package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.jso.ExportedDataItem;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.storage.store.ExportedWebSql;
import org.rest.client.storage.store.RequestDataStoreWebSql;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.xhr2.client.RequestHeader;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Class for export data to remote service. It give basic functionality for
 * prepare data to send.
 * 
 * @author Paweł Psztyć
 */
abstract class DataExport {

	EventBus eventBus = null;
	/**
	 * All data retrieved from database
	 */
	private JsArray<RequestObject> allDataList;
	/**
	 * All already synch items id's
	 */
	private List<Integer> excludeList = new ArrayList<Integer>();
	/**
	 * List of ID's of items that will be saved on server. After successful send
	 * it should be saved in Database
	 */
	protected List<Integer> includeList = new ArrayList<Integer>();

	static interface PrepareDataHanler {
		/**
		 * Called when user data has been prepared to send.
		 * 
		 * @param data
		 *            collected data ready to send.
		 */
		void onPrepare(JSONObject data);

		/**
		 * Called when prepared data has no data to send.
		 */
		void onEmptyData();
	}

	static interface ExportItemCallback {
		void onSuccess(ExportedDataItem item);

		void onFailure(String message);
	}

	/**
	 * Collect data from database and remove items already exported.
	 */
	protected void prepareExportData(final PrepareDataHanler handler) {
		RestClient.getClientFactory().getRequestDataStore().all(new RequestDataStoreWebSql.StoreResultsCallback() {
			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Failure to prepare Form data from DB service", e);
				}
				StatusNotification.notify("Failure to prepare Form data from local database");
			}

			@Override
			public void onSuccess(final JsArray<RequestObject> result) {
				JsArrayInteger formIdsList = (JsArrayInteger) JsArrayInteger.createArray();
				for (int i = 0; i < result.length(); i++) {
					RequestObject item = result.get(i);
					formIdsList.set(i, item.getId());
				}
				
				allDataList = result;
				RestClient.getClientFactory().getExportedStore()
						.getExportedByReferenceIds(formIdsList, new ExportedWebSql.StoreResultsCallback() {
					@Override
					public void onError(Throwable e) {
						synchPrepareData(handler);
					}

					@Override
					public void onSuccess(JsArray<ExportedDataItem> res) {
						excludeList = new ArrayList<Integer>();
						for (int i = 0; i < res.length(); i++) {
							excludeList.add(res.get(i).getReferenceId());
						}
						synchPrepareData(handler);
					}
				});
			}
		});
	}

	private void synchPrepareData(final PrepareDataHanler handler) {
		List<RequestObject> readyToSendList = new ArrayList<RequestObject>();
		for (int i = 0; i < allDataList.length(); i++) {
			RequestObject item = allDataList.get(i);
			if (excludeList.contains(item.getId()))
				continue;
			readyToSendList.add(item);
			includeList.add(item.getId());
		}

		if (readyToSendList.size() == 0) {
			allDataList = null;
			excludeList = null;
			includeList = null;
			handler.onEmptyData();
			return;
		}
		final JSONObject data = new JSONObject();
		JSONArray arr = new JSONArray();
		for (RequestObject item : readyToSendList) {
			RestForm row = new RestForm();
			JSONObject _data = new JSONObject();
			_data.put("url", new JSONString(item.getURL() == null ? "" : item.getURL()));
			_data.put("post", new JSONString(item.getPayload() == null ? "" : item.getPayload()));
			_data.put("method", new JSONString(item.getMethod() == null ? "" : item.getMethod()));
			_data.put("formEncoding", new JSONString(item.getEncoding() == null ? "" : item.getEncoding()));
			JSONArray _headersArray = new JSONArray();
			ArrayList<RequestHeader> _list = RequestHeadersParser.stringToHeaders(item.getHeaders());
			for (RequestHeader _h : _list) {
				JSONObject ho = new JSONObject();
				ho.put(_h.getName(), new JSONString(_h.getValue() == null ? "" : _h.getValue()));
				_headersArray.set(_headersArray.size(), ho);
			}
			_data.put("headers", _headersArray);
			row.setData(_data.toString());
			row.setId(item.getId());
			row.setName(item.getName());
			row.setTime((long) item.getTime());
			row.setUrl(item.getURL());

			JSONObject jsonValue = row.toJSON();
			if (jsonValue == null)
				continue;
			jsonValue.put("i", new JSONNumber(row.getId()));
			arr.set(arr.size(), jsonValue);

		}
		data.put("d", arr);
		allDataList = null;
		excludeList = null;
		
		RestClient.getAppId(new Callback<String, Throwable>() {
			
			@Override
			public void onSuccess(String result) {
				data.put("i", new JSONString(result));
				handler.onPrepare(data);
			}
			
			@Override
			public void onFailure(Throwable reason) {
				//TODO: error message to the user.
				handler.onEmptyData();
			}
		});
	}

	/**
	 * Export all data from application to remote service
	 */
	abstract void synch();

	/**
	 * Export only one item to server
	 * 
	 * @param item
	 */
	abstract void exportItem(RestForm item, ExportItemCallback callback);

	/**
	 * Sets application event bus.
	 * 
	 * @param eventBus
	 */
	abstract void setEventBus(EventBus eventBus);
}
