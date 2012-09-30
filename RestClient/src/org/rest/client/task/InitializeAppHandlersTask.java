package org.rest.client.task;

import org.rest.client.AppEventsHandlers;
import org.rest.client.AppRequestFactory;
import org.rest.client.ExternalEventsFactory;
import org.rest.client.RestClient;
import org.rest.client.ShortcutHandlers;
import org.rest.client.UserNotificationsFactory;
import org.rest.client.task.ui.LoaderWidget;

import com.google.web.bindery.event.shared.EventBus;

public class InitializeAppHandlersTask implements LoadTask {
	
	LoaderWidget loaderWidget;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Initialize events handlers");
		}
		EventBus eventBus = RestClient.getClientFactory().getEventBus();
		
		AppEventsHandlers.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		ShortcutHandlers.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		ExternalEventsFactory.init(eventBus);
		callback.onInnerTaskFinished(1);
		AppRequestFactory.initialize(eventBus);
		callback.onInnerTaskFinished(1);
		RestClient.getClientFactory().getChromeMessagePassing();
		callback.onInnerTaskFinished(1);
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
