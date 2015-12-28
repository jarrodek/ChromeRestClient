package org.rest.client.task;

import org.rest.client.SyncAdapter;

import com.google.gwt.core.client.Callback;

/**
 * Read locally saved data (from LocalStorage) and set up SyncAdapter values.
 * The values will be overrided when SyncAdapter will sync all data.
 * 
 * @TODO: This app is using window.localstorage which is not compatible with Chrome Apps. In future release it must be replaced with chrome.storage API
 * 
 * @author Pawel Psztyc
 */
public class SetSyncDataTask implements LoadTask {
	LoaderWidget loaderWidget;
	TasksCallback callback;
	
	@Override
	public void run(final TasksCallback callback, final boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Setting up synced values");
		}
		this.callback = callback;
		runSyncAdapter();
	}
	
	
	private void runSyncAdapter(){
		SyncAdapter.sync(new Callback<Void, Void>() {

			@Override
			public void onFailure(Void reason) {
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}

			@Override
			public void onSuccess(Void result) {
				callback.onInnerTaskFinished(1);
				callback.onSuccess();
			}
		});
	}

	@Override
	public int getTasksCount() {
		return 1;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}
}
