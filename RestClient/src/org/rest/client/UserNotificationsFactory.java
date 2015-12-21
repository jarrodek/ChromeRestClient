package org.rest.client;

import java.util.ArrayList;
import java.util.Date;

import org.rest.client.StatusNotification.NotificationCallback;
import org.rest.client.event.NotificationsStateChangeEvent;
import org.rest.client.request.MessageObject;
import org.rest.client.request.MessagesRequest;
import org.rest.client.storage.store.StoreKeys;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.tabs.CreateProperties;
import com.google.gwt.chrome.tabs.Tab;
import com.google.gwt.chrome.tabs.TabCallback;
import com.google.gwt.chrome.tabs.Tabs;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.Timer;

public class UserNotificationsFactory {
	
	private static boolean registered = false;
	private static Timer messageSchedule = null;
	
	/**
	 * Register notification mechanism with delay
	 */
	public static void registerDelay(){
		if(registered) return;
		registered = true;
		
		Timer t = new Timer() {
			@Override
			public void run() {
				
				runNotifications();
				
				NotificationsStateChangeEvent.register(RestClient.getClientFactory().getEventBus(), new NotificationsStateChangeEvent.Handler() {
					@Override
					public void onStateChange(boolean state) {
						onSettingsStateChange(state);
					}
				});
			}
		};
		
		t.schedule(1000); //1 minute, 60000
	}
	
	
	private static void onSettingsStateChange(boolean currentState){
		if(currentState){
			runNotifications();
		} else {
			if(messageSchedule != null){
				messageSchedule.cancel();
			}
		}
	}
	
	/**
	 * Run notification system.
	 * The notification system will attempt to download messages list from the server and display it as a toast. 
	 */
	private static void runNotifications(){
		
		if(messageSchedule != null){
			messageSchedule.cancel();
		}
		
		Storage store = GWT.create(Storage.class);
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.LATEST_MESSAGE_KEY, new JSONObject(null));
		store.getLocal().get(jo.getJavaScriptObject(), new StorageItemsCallback() {
			
			@Override
			public void onError(String message) {
				Log.warn("Error getting User notification chrome storage setting: " + message);
			}

			@Override
			public void onResult(JavaScriptObject result) {
				if(result != null){
					StorageResult<Double> data = result.cast();
					Double since = data.getDouble(StoreKeys.LATEST_MESSAGE_KEY);
					if(since == null){
						since = new Double(0);
					}
					getMessages(since);
				} else {
					Date d = new Date();
					long time = d.getTime();
					time -= 1209600000; //14 days in the past
					getMessages(time);
				}
			}
		});
		
		//schedule next check
		messageSchedule = new Timer() {
			@Override
			public void run() {
				runNotifications();
			}
		};
		messageSchedule.schedule(3600000); //1hr
	}
	
	private final static native double getSince(JavaScriptObject result, String key) /*-{
		var since = 0;
		if(result === null) return since;
		if((key in result) && typeof result[key] === "number"){
			since = result[key];
		}
		return since;
	}-*/;
	
	
	/**
	 * Download messages from server.
	 * @param since timestamp from when get the messages list
	 */
	private static void getMessages(double since){
		MessagesRequest.getMessages(since, new MessagesRequest.MessagesHandler() {
			@Override
			public void onMessages(ArrayList<MessageObject> result) {
				long current = new Date().getTime();
				JSONObject setObj = new JSONObject();
				setObj.put(StoreKeys.LATEST_MESSAGE_KEY, new JSONNumber(current));
				
				Storage store = GWT.create(Storage.class);
				store.getLocal().set(setObj.getJavaScriptObject(), new StorageArea.StorageSimpleCallback() {
					
					@Override
					public void onError(String message) {
						Log.warn("Couldn't set last message timestamp! " + message);
					}
					
					@Override
					public void onDone() {}
				});
				//store.setItem(LocalStore.LATEST_MESSAGE_KEY, current+"");
				
				if(result == null || result.size() == 0){
					return;
				}
				notifyUser(result);
			}
		});
	}
	/**
	 * Notify the user ablut new messages.
	 * @param messages
	 */
	private static void notifyUser(ArrayList<MessageObject> messages){
		for(final MessageObject msg : messages){
			if(msg.getActionUrl() != null){
				NotificationAction na = new NotificationAction();
				na.name = "More info";
				na.callback = new NotificationCallback() {
					@Override
					public void onActionPerformed() {
						Tabs tabs = GWT.create(Tabs.class);
						CreateProperties cp = CreateProperties.create();
						cp.setUrl(msg.getActionUrl());
						tabs.create(cp, new TabCallback() {
							@Override
							public void onResult(Tab tab) {}
						});
					}
				};
				StatusNotification.notify(msg.getMessage(), StatusNotification.TIME_INFINITY, na);
			} else {
				StatusNotification.notify(msg.getMessage(), StatusNotification.TIME_INFINITY);
			}
		}
	}
}
