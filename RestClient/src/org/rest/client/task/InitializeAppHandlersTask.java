package org.rest.client.task;

import org.rest.client.AppEventsHandlers;
import org.rest.client.AppRequestFactory;
import org.rest.client.ExternalEventsFactory;
import org.rest.client.RestClient;
import org.rest.client.ShortcutHandlers;
import org.rest.client.UserNotificationsFactory;

import com.google.web.bindery.event.shared.EventBus;

public class InitializeAppHandlersTask implements LoadTask {
	
	LoaderWidget loaderWidget;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers");
		}
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: App events");
		}
		AppEventsHandlers.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: Shortcuts");
		}
		ShortcutHandlers.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: External events");
		}
		ExternalEventsFactory.init(eventBus);
		callback.onInnerTaskFinished(1);
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: App request factory");
		}
		AppRequestFactory.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: Message passing");
		}
		RestClient.getClientFactory().getChromeMessagePassing();
		callback.onInnerTaskFinished(1);
		if(loaderWidget != null){
			loaderWidget.setText("Initialize event handlers: Notifications");
		}
		UserNotificationsFactory.registerDelay();
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 6;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}

}
