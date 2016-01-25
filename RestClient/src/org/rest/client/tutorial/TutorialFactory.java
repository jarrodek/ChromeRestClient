package org.rest.client.tutorial;

import java.util.ArrayList;

import org.rest.client.RestClient;
import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.log.Log;
import org.rest.client.storage.store.StoreKeys;
import org.rest.client.ui.TutorialDialog;
import org.rest.client.ui.TutorialDialog.Controls;
import org.rest.client.ui.desktop.TutorialDialogImpl;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.chrome.storage.SyncStorageArea;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArrayString;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.user.client.ui.RootPanel;

public class TutorialFactory {
	
	private final String tutorialName;
	private ArrayList<TutorialDialog> items = new ArrayList<TutorialDialog>();
	private TutorialDialog currentItem = null;
	private boolean canRun = false;
	private boolean alwaysRun = false;
	private int current = 0;

	public TutorialFactory(String tutorialName) {
		this.tutorialName = tutorialName;
		this.alwaysRun = false;
	}
	/**
	 * Initialize tutorial factory without checking if tutorial has been already seen
	 * @param tutorialName
	 * @param alwaysRun
	 */
	public TutorialFactory(String tutorialName, boolean alwaysRun) {
		this.tutorialName = tutorialName;
		this.alwaysRun = alwaysRun;
		canRun = true;
	}
	
	
	public void canStartTutorial(final Callback<Boolean, Throwable> callback){
		checkStatus(callback);
	}
	
	
	
	/**
	 * Check if local store contains this tutorial name. If it does, don't show
	 * tutorial.
	 */
	private void checkStatus(final Callback<Boolean, Throwable> callback) {
		if(alwaysRun){
			canRun = true;
			callback.onSuccess(canRun);
			return;
		}
		Storage store = GWT.create(Storage.class);
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.TUTORIALS, new JSONArray(null));
		store.getSync().get(jo.getJavaScriptObject(), new StorageArea.StorageItemsCallback() {

			@Override
			public void onError(String message) {
				if(RestClient.isDebug()){
					Log.error("TutorialFactory::checkStatus - " + message);
				}
				callback.onFailure(new Throwable(message));
			}

			@Override
			public void onResult(JavaScriptObject result) {
				if(result == null){
					canRun = true;
					callback.onSuccess(canRun);
					return;
				}
				StorageResult<JsArrayString> data = result.cast();
				JsArrayString arr = (JsArrayString) data.getObject(StoreKeys.TUTORIALS);
				if(arr == null){
					canRun = true;
					callback.onSuccess(canRun);
					return;
				}
				if(arr.join(";").indexOf(tutorialName) != -1){
					canRun = false;
				}
				callback.onSuccess(canRun);
			}
		});
	}

	public static TutorialDialog createItem() {
		return GWT.create(TutorialDialogImpl.class);
	}

	public void addItem(TutorialDialog item) {
		if(!canRun) return;
		items.add(item);
	}
	
	private void preserveFuturerTutorials(){
		if(alwaysRun) return;
		Storage store = GWT.create(Storage.class);
		final SyncStorageArea sync = store.getSync();
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.TUTORIALS, new JSONArray(null));
		sync.get(jo.getJavaScriptObject(), new StorageArea.StorageItemsCallback() {

			@Override
			public void onError(String message) {
				if(RestClient.isDebug()){
					Log.error("TutorialFactory::preserveFuturerTutorials (sync.get) - " + message);
				}
			}

			@Override
			public void onResult(JavaScriptObject result) {
				StorageResult<JsArrayString> data = result.cast();
				JSONArray arr = new JSONArray();
				if(data != null){
					JsArrayString existing = (JsArrayString) data.getObject(StoreKeys.TUTORIALS);
					if(existing != null){
						int len = existing.length();
						for(int i=0; i<len; i++){
							arr.set(arr.size(), new JSONString(existing.get(i)));
						}
					}
				}
				arr.set(arr.size(), new JSONString(tutorialName));
				JSONObject jo = new JSONObject();
				jo.put(StoreKeys.TUTORIALS, arr);
				sync.set(jo.getJavaScriptObject(), new StorageSimpleCallback() {
					
					@Override
					public void onError(String message) {
						if(RestClient.isDebug()){
							Log.error("TutorialFactory::preserveFuturerTutorials (sync.set) - " + message);
						}
					}
					
					@Override
					public void onDone() {
						// TODO Auto-generated method stub
						
					}
				});
			}
		});
	}
	
	public void start(){
		if(!canRun) return;
		preserveFuturerTutorials();
		
		current = 0;
		showNext();
	}
	
	public void showNext(){
		if(currentItem != null){
			RootPanel.get(null).remove(currentItem);
		}
		currentItem = null;
		
		int itemsSize = items.size();		
		if(itemsSize<current+1){
			//no more items...
			items.clear();
			return;
		}
		
		currentItem = items.get(current);
		boolean hasNext = false;
		boolean hasPrev = false;
		boolean isLast = false;
		if(itemsSize>current+1){
			hasNext = true;
		}
		if(current>0){
			hasPrev = true;
		}
		if(itemsSize > 1 && itemsSize == current+1){
			isLast = true;
		}
		if(isLast && hasPrev){
			currentItem.showControls(Controls.PREV_CLOSE);
		} else if(hasNext && hasPrev){
			currentItem.showControls(Controls.PREV_NEXT);
		} else if(hasPrev){
			currentItem.showControls(Controls.PREV_ONLY);
		} else if(hasNext){
			currentItem.showControls(Controls.NEXT_ONLY);
		}
		
		currentItem.setCloseHandler(new TutorialDialog.CloseTutorialHandler() {
			@Override
			public void onClose(int lastUserAction) {
				switch(lastUserAction){
				case TutorialDialog.UserAction.CLOSE:
					breakUpTutorial();
					break;
				case TutorialDialog.UserAction.NEXT:
					showNext();
					break;
				case TutorialDialog.UserAction.PREV:
					current -= 2;
					showNext();
					break;
				}
			}
		});
		RootPanel.get(null).add(currentItem);
		currentItem.show();
		current++;
	}
	
	
	private void breakUpTutorial(){
		if(currentItem != null){
			RootPanel.get(null).remove(currentItem);
		}
		currentItem = null;
		int itemsSize = items.size();
		int value = 0;
		if(itemsSize > 1 && itemsSize == current+1){
			value = current;
		}
		items.clear();
		GoogleAnalytics.sendEvent("Tutorial","Break up", tutorialName, value);
		GoogleAnalyticsApp.sendEvent("Tutorial","Break up", tutorialName, value);
	}
	
	public void clear(){
		if(items.size() > 0){
			breakUpTutorial();
		}
	}
}
