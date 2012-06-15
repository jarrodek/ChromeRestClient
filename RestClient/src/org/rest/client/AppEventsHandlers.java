package org.rest.client;

import org.rest.client.event.SaveRequestEvent;
import org.rest.client.ui.SaveRequestDialogView;

import com.google.web.bindery.event.shared.EventBus;

public class AppEventsHandlers {
	
	private static EventBus eventBus;

	public static void initialize(){
		eventBus = RestClient.getClientFactory().getEventBus();
		
		
		SaveRequestEvent.register(eventBus, new SaveRequestEvent.Handler() {
			@Override
			public void onSave() {
				SaveRequestDialogView dialog = RestClient.getClientFactory().getSaveRequestDialogView();
				dialog.show();
			}
		});
		
		
		
	}
	
	
	
}
