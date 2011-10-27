package com.restclient.client.tasks;

import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;

@SuppressWarnings("javadoc")
public class StateRestoreTask implements LoadTask {
	
	TasksCallback callback;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		this.callback = callback;
		ViewParameters.restore();
		callback.onInnerTaskFinished();
		RequestParameters.restoreFromStorage();
		callback.onInnerTaskFinished();
		callback.onSuccess();
	}
	
	@Override
	public int getTasksCount() {
		return 2;
	}
	
}
