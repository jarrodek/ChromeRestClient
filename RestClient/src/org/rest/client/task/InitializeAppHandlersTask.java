package org.rest.client.task;

import org.rest.client.AppEventsHandlers;
import org.rest.client.ShortcutHandlers;
import org.rest.client.load.LoadTask;
import org.rest.client.load.TasksCallback;

public class InitializeAppHandlersTask implements LoadTask {

	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		
		ShortcutHandlers.initialize();
		AppEventsHandlers.initialize();
		
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 1;
	}

}
