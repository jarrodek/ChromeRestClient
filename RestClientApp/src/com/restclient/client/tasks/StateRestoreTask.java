package com.restclient.client.tasks;

import com.restclient.client.ShortcutHandlers;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;

@SuppressWarnings("javadoc")
public class StateRestoreTask implements LoadTask {
	
	TasksCallback callback;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		this.callback = callback;
		//
		// Restore view.
		//
		ViewParameters.restore();
		callback.onInnerTaskFinished();
		//
		// Restore request parameters
		//
		RequestParameters.restoreFromStorage();
		callback.onInnerTaskFinished();
		//
		// Set shortcuts
		//
		ShortcutHandlers.initialize();
		callback.onInnerTaskFinished();
		
		callback.onSuccess();
	}
	
	@Override
	public int getTasksCount() {
		return 3;
	}
	
}
