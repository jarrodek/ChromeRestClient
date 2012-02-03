package com.restclient.client.tasks;

import com.allen_sauer.gwt.log.client.Log;
import com.restclient.client.RestApp;
import com.restclient.client.ShortcutHandlers;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;

@SuppressWarnings("javadoc")
public class StateRestoreTask implements LoadTask {
	
	TasksCallback callback;
	
	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		if(RestApp.isDebug()){
			Log.debug("Start task: restore view and form state.");
		}
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
