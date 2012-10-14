package org.rest.client.task;

import java.util.ArrayList;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.WebSqlAdapter;
import org.rest.client.task.ui.LoaderWidget;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.VoidCallback;

/**
 * The first task during startup. Initialize databases and set handlers to
 * databases. It's call "initTable" method in each DB service which contains
 * create table statement.
 * 
 * @author jarrod
 * 
 */
public class InitializeDatabaseTask implements LoadTask {

	private int dbOpened = 0;
	@SuppressWarnings({ "rawtypes" })
	ArrayList<WebSqlAdapter> databases = new ArrayList<WebSqlAdapter>();
	LoaderWidget loaderWidget;

	@SuppressWarnings({ "rawtypes" })
	public InitializeDatabaseTask() {
		
		ClientFactory factory = RestClient.getClientFactory();
		try{
			databases.add((WebSqlAdapter) factory.getHeadersStore());
			databases.add((WebSqlAdapter) factory.getStatusesStore());
			databases.add((WebSqlAdapter) factory.getHistoryRequestStore());
			databases.add((WebSqlAdapter) factory.getUrlHistoryStore());
			databases.add((WebSqlAdapter) factory.getFormEncodingStore());
			databases.add((WebSqlAdapter) factory.getRequestDataStore());
			databases.add((WebSqlAdapter) factory.getProjectsStore());
			databases.add((WebSqlAdapter) factory.getWebSocketsStore());
		} catch(Exception e){
			e.printStackTrace();
			Log.error("Unable to initializa database",e);
		}
	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	public void run(final TasksCallback callback, final boolean lastRun) {
		if(loaderWidget != null){
			loaderWidget.setText("Initialize databases");
		}
		final int dbCount = databases.size();
		
		if(dbCount == 0){
			if(lastRun){
				callback.onFatalError("Unable to initializa database. This is fatal.");
				return;
			}
			callback.onFailure(0);
			return;
		}
		
		for (WebSqlAdapter db : databases) {
			db.open(new StoreResultCallback<Boolean>() {

				@Override
				public void onSuccess(Boolean result) {
					callback.onInnerTaskFinished(1);
					dbOpened++;
					if (dbCount == dbOpened) {
						//
						// Temporary service
						// TODO: remove December 1st, 2012.
						//
						RestClient.getClientFactory().getExportedDataReferenceService().initTable(new VoidCallback() {
							
							@Override
							public void onFailure(DataServiceException error) {
								Log.error("Unable initialize exported data service", error);
							}
							@Override
							public void onSuccess() {}
						});
						callback.onSuccess();
					}
				}

				@Override
				public void onError(Throwable e) {
					if(lastRun){
						callback.onFatalError("Unable to initialize WebSQL database :( Can't run application.");
						return;
					}
					callback.onFailure(dbOpened);
				}
			});
		}
		
		
	}

	@Override
	public int getTasksCount() {
		return databases.size();
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		this.loaderWidget = loaderWidget;
	}

}
