package org.rest.client;

import java.util.ArrayList;
import java.util.Date;

import org.rest.client.event.NotificationsArriveEvent;
import org.rest.client.event.NotificationsStateChangeEvent;
import org.rest.client.request.MessageObject;
import org.rest.client.request.MessagesRequest;
import org.rest.client.storage.store.LocalStore;

import com.google.gwt.storage.client.Storage;
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
		if(!SyncAdapter.isNotifications()){
			return;
		}
		
		if(messageSchedule != null){
			messageSchedule.cancel();
		}
		
		final Storage store = Storage.getLocalStorageIfSupported();
		
		String sinceValue = store.getItem(LocalStore.LATEST_MESSAGE_KEY);
		long since = 0;
		if(sinceValue != null && !sinceValue.isEmpty()){
			try{
				since = Long.parseLong(sinceValue);
			} catch(Exception e){}
		}
		MessagesRequest.getMessages(since, new MessagesRequest.MessagesHandler() {
			@Override
			public void onMessages(ArrayList<MessageObject> result) {
				long current = new Date().getTime(); 
				store.setItem(LocalStore.LATEST_MESSAGE_KEY, current+"");
				
				if(result == null || result.size() == 0){
					return;
				}
				
				RestClient.getClientFactory().getEventBus().fireEvent(new NotificationsArriveEvent(result));
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
	
}
