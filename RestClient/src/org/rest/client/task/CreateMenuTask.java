package org.rest.client.task;

import org.rest.client.RestClient;
import org.rest.client.UserMenuHandler;
import org.rest.client.task.ui.LoaderWidget;

public class CreateMenuTask implements LoadTask {

	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		new UserMenuHandler(RestClient.getClientFactory());
		
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 1;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		// TODO Auto-generated method stub
		
	}

}
