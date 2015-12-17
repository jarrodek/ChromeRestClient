package org.rest.client;

import java.util.ArrayList;
import java.util.Date;

import org.rest.client.event.NotificationsStateChangeEvent;
import org.rest.client.request.MessageObject;
import org.rest.client.request.MessagesRequest;
import org.rest.client.storage.store.StoreKeys;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageItemCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.GWT;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.safehtml.shared.SafeHtmlUtils;
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
	
	
	
	private static void runNotifications(){
		if(!SyncAdapter.notifications){
			return;
		}
		
		if(messageSchedule != null){
			messageSchedule.cancel();
		}
		
		final Storage store = GWT.create(Storage.class);
		store.getLocal().get(StoreKeys.LATEST_MESSAGE_KEY, new StorageItemCallback<Double>() {
			@Override
			public void onResult(StorageResult<Double> sinceValue) {
				if(sinceValue != null){
					double since = 0;
					try{
						since = sinceValue.get(StoreKeys.LATEST_MESSAGE_KEY);
					} catch(Exception e){
						Log.warn("Error getting User notification chrome storage setting: " + e.getMessage(), e);
					}
					MessagesRequest.getMessages(since, new MessagesRequest.MessagesHandler() {
						@Override
						public void onMessages(ArrayList<MessageObject> result) {
							long current = new Date().getTime();
							JSONObject setObj = new JSONObject();
							setObj.put(StoreKeys.LATEST_MESSAGE_KEY, new JSONNumber(current));
							
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
				
			}
			
			@Override
			public void onError(String message) {
				Log.warn("Error getting User notification chrome storage setting: " + message);
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
	
	
	private static void notifyUser(ArrayList<MessageObject> messages){
		for(MessageObject msg : messages){
			String msgStr = "<strong>"+SafeHtmlUtils.htmlEscape(msg.getTitle())+"</strong><br/>";
			msgStr += SafeHtmlUtils.htmlEscape(msg.getMessage());
			
			StatusNotification.notify(msgStr, StatusNotification.TYPE_HTML, StatusNotification.TIME_INFINITY, false);
		}
	}
}
