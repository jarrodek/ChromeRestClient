package org.rest.client;

import org.rest.client.event.SaveRequestEvent;
import org.rest.client.ui.SaveRequestDialogView;

import com.google.web.bindery.event.shared.EventBus;

public class AppEventsHandlers {
	
	public static void initialize(final EventBus eventBus){
		
		SaveRequestEvent.register(eventBus, new SaveRequestEvent.Handler() {
			@Override
			public void onSave() {
				SaveRequestDialogView dialog = RestClient.getClientFactory().getSaveRequestDialogView();
				dialog.show();
			}
		});
		
		
		
		
		
	}
	
}
