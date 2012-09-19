package org.rest.client.deprecated;

import java.util.ArrayList;
import java.util.List;

import org.rest.client.RestClient;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.storage.websql.ExportedDataInsertItem;
import org.rest.client.storage.websql.ExportedDataItem;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.xhr2.client.RequestHeader;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Class for export data to remote service.
 * It give basic functionality for prepare data to send.
 * 
 * @author Paweł Psztyć
 */
public abstract class DataExport {
	
	EventBus eventBus = null;
	/**
	 * All data retrieved from database
	 */
	protected List<RequestObject> allDataList = new ArrayList<RequestObject>();
	/**
	 * All already synch items id's 
	 */
	protected List<Integer> excludeList = new ArrayList<Integer>();
	/**
	 * List of ID's of items that will be saved on server.
	 * After successful send it should be saved in Database
	 */
	protected List<Integer> includeList = new ArrayList<Integer>();
	
	
	public static interface PrepareDataHanler {
		/**
		 * Called when user data has been prepared to send.
		 * @param data collected data ready to send.
		 */
		void onPrepare(JSONObject data);
		/**
		 * Called when prepared data has no data to send.
		 */
		void onEmptyData();
	}
	
	public static interface ExportItemCallback {
		void onSuccess(ExportedDataInsertItem item);
		void onFailure(String message);
	}
	
	
	/**
	 * Collect data from database and remove items already exported.
	 */
	protected void prepareExportData(final PrepareDataHanler handler){
		RestClient.getClientFactory().getRequestDataStore().getService().getAllData(new ListCallback<RequestObject>() {
			@Override
			public void onFailure(DataServiceException error) {
				if(RestClient.isDebug()){
					Log.error("Failure to prepare Form data from DB service", error);
				}
				StatusNotification.notify("Failure to prepare Form data from local database", StatusNotification.TYPE_ERROR);
			}
			@Override
			public void onSuccess(final List<RequestObject> result) {
				final ArrayList<Integer> formIdsList = new ArrayList<Integer>();
				for(RequestObject item : result){
					formIdsList.add(item.getId());
				}
				Log.debug("prepared " + formIdsList.size() + " items to export.");
				allDataList = result;
				RestClient.getClientFactory().getExportedDataReferenceService().getExportedFormByReferenceId(formIdsList, new ListCallback<ExportedDataItem>() {
					@Override
					public void onFailure(DataServiceException error) {
						synchPrepareData(handler);
					}
					@Override
					public void onSuccess(List<ExportedDataItem> res) {
						excludeList = new ArrayList<Integer>();
						for(ExportedDataItem _item : res){
							excludeList.add(_item.getReferenceId());
						}
						Log.debug("exlude " + excludeList.size() + " items from export.");
						synchPrepareData(handler);
					}
				});
			}
		});
	}
	
	protected void synchPrepareData(final PrepareDataHanler handler){
		List<RequestObject> readyToSendList = new ArrayList<RequestObject>();
		
		for(RequestObject item : allDataList){
			if(excludeList.contains(item.getId())) continue;
			readyToSendList.add(item);
			includeList.add(item.getId());
		}
		
		Log.debug("readyToSendList: " + readyToSendList.size());
		
		if(readyToSendList.size() == 0){
			allDataList = null;
			excludeList = null;
			includeList = null;
			handler.onEmptyData();
			return;
		}
		JSONObject data = new JSONObject();
		JSONArray arr = new JSONArray();
		for(RequestObject item : readyToSendList){
			RestForm row = new RestForm();
			JSONObject _data = new JSONObject();
			_data.put("url", new JSONString(item.getURL()==null?"":item.getURL()));
			_data.put("post", new JSONString(item.getPayload()==null?"":item.getPayload()));
			_data.put("method", new JSONString(item.getMethod()==null?"":item.getMethod()));
			_data.put("formEncoding", new JSONString(item.getEncoding() == null ? "" : item.getEncoding()));
			JSONArray _headersArray = new JSONArray();
			ArrayList<RequestHeader> _list = RequestHeadersParser.stringToHeaders(item.getHeaders());
			for(RequestHeader _h : _list){
				JSONObject ho = new JSONObject();
				ho.put(_h.getName(), new JSONString(_h.getValue()));
				_headersArray.set(_headersArray.size(), ho);
			}
			_data.put("headers", _headersArray);
			row.setData(_data.toString());
			row.setId(item.getId());
			row.setName(item.getName());
			row.setTime((long)item.getTime());
			row.setUrl(item.getURL());
			
			JSONObject jsonValue = row.toJSON();
			if(jsonValue == null) continue;
			jsonValue.put("i", new JSONNumber(row.getId()));
			arr.set(arr.size(), jsonValue);
			
		}
		data.put("d", arr);
		data.put("i", new JSONString(RestClient.getAppId()));
		allDataList = null;
		excludeList = null;
		handler.onPrepare(data);
	}
	
	
	/**
	 * Export all data from application to remote service
	 */
	abstract void synch();
	/**
	 * Export only one item to server
	 * @param item
	 */
	abstract void exportItem(RestForm item, ExportItemCallback callback);
	/**
	 * Sets application event bus.
	 * @param eventBus
	 */
	abstract void setEventBus(EventBus eventBus);
}
