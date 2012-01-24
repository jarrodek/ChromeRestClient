package com.restclient.client;

import java.util.ArrayList;
import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.web.bindery.event.shared.EventBus;
import com.restclient.client.storage.ExportedDataItem;
import com.restclient.client.storage.RestForm;
import com.restclient.client.storage.RestFormJS;

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
	protected List<RestFormJS> allDataList = new ArrayList<RestFormJS>();
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
	
	
	/**
	 * Collect data from database and remove items already exported.
	 */
	protected void prepareExportData(final PrepareDataHanler handler){
		RestApp.FORM_SERVICE.getAllData(new ListCallback<RestFormJS>() {
			@Override
			public void onFailure(DataServiceException error) {
				if( RestApp.isDebug() ){
					Log.error("Failure to prepare Form data from DB service", error);
				}
				StatusNotification.notify("Failure to prepare Form data from local database", StatusNotification.TYPE_ERROR);
			}
			@Override
			public void onSuccess(final List<RestFormJS> result) {
				final ArrayList<Integer> formIdsList = new ArrayList<Integer>();
				for(RestFormJS item : result){
					formIdsList.add(item.getId());
				}
				allDataList = result;
				RestApp.EXPORT_DATA_SERVICE.getExportedByReferenceId(formIdsList, new ListCallback<ExportedDataItem>() {
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
						synchPrepareData(handler);
					}
				});
			}
		});
	}
	
	protected void synchPrepareData(final PrepareDataHanler handler){
		List<RestFormJS> readyToSendList = new ArrayList<RestFormJS>();
		
		for(RestFormJS item : allDataList){
			if(excludeList.contains(item.getId())) continue;
			readyToSendList.add(item);
			includeList.add(item.getId());
		}
		if(readyToSendList.size() == 0){
			allDataList = null;
			excludeList = null;
			includeList = null;
			handler.onEmptyData();
			return;
		}
		JSONObject data = new JSONObject();
		JSONArray arr = new JSONArray();
		for(RestFormJS item : readyToSendList){
			
			RestForm row = new RestForm();
			row.setData(item.getData());
			row.setId(item.getId());
			row.setName(item.getName());
			row.setTime(item.getTime());
			row.setUrl(item.getUrl());
			
			JSONObject jsonValue = row.toJSON();
			if(jsonValue == null) continue;
			arr.set(arr.size(), jsonValue);
		}
		data.put("d", arr);
		data.put("i", new JSONString(RestApp.getAppId()));
		allDataList = null;
		excludeList = null;
		handler.onPrepare(data);
	}
	
	
	/**
	 * Export all data from application to remote service
	 */
	abstract void synch();
	/**
	 * Sets application event bus.
	 * @param eventBus
	 */
	abstract void setEventBus(EventBus eventBus);
}
