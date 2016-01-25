package org.rest.client.activity;

import java.util.ArrayList;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.deprecated.DataExportImpl;
import org.rest.client.event.StoreDataEvent;
import org.rest.client.importparser.ImportParser;
import org.rest.client.importparser.ImportResult;
import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestDataJso;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.request.ApplicationSession;
import org.rest.client.request.ImportDataCallback;
import org.rest.client.request.RequestImportListObject;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.RequestDataStoreWebSql;
import org.rest.client.storage.websql.ExportedDataInsertItem;
import org.rest.client.ui.ImportExportView;
import org.rest.client.ui.ImportExportView.StringCallback;

import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.core.client.JsArrayInteger;
import com.google.gwt.file.client.File;
import com.google.gwt.file.client.FileError;
import com.google.gwt.filereader.client.ErrorHandler;
import com.google.gwt.filereader.client.FileReader;
import com.google.gwt.filereader.client.LoadHandler;
import com.google.gwt.json.client.JSONArray;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.web.bindery.event.shared.EventBus;

public class ImportExportActivity extends AppActivity implements ImportExportView.Presenter {

	final private ImportExportPlace place;
	private EventBus eventBus;
	private ImportExportView view;
	private String exportFileObjectUrl = null;

	public ImportExportActivity(ImportExportPlace place, ClientFactory clientFactory) {
		super(clientFactory);
		this.place = place;
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		this.eventBus = eventBus;
		super.start(panel, eventBus);

		view = clientFactory.getImportExportView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());
		
		handleSessionChange();
		checkServerSession();
		
		StoreDataEvent.register(eventBus, new StoreDataEvent.Handler() {
			@Override
			public void onSuccess() {
				if (view != null){
					StatusNotification.notify("Your data has been stored to the server", StatusNotification.TIME_MEDIUM);
					view.resetServerView();
				}
			}

			@Override
			public void onFailure() {
				if (view != null){
					StatusNotification.notify("There was an error when storing your data", StatusNotification.TIME_MEDIUM);
					view.resetServerView();
					GoogleAnalytics.sendException("ImportExportActivity::StoreDataEvent::onFailure::Couldn't store data.");
					GoogleAnalyticsApp.sendException("ImportExportActivity::StoreDataEvent::onFailure::Couldn't store data.");
				}
			}
		});

		if (place.isServerImport()) {
			requestImportSuggestions(place.getServerImportApplicationId());
		}
	}

	@Override
	public void prepareDataToFile(final StringCallback callback) {
		//
		// Get all request data
		//
		clientFactory.getRequestDataStore().all(new RequestDataStoreWebSql.StoreResultsCallback() {
			@Override
			public void onSuccess(final JsArray<RequestObject> requestDataResult) {
				//
				// Get project data
				//
				clientFactory.getProjectsStore().all(new ProjectStoreWebSql.StoreResultsCallback() {
					@Override
					public void onSuccess(final JsArray<ProjectObject> projectDataResult) {

						JSONArray requestsArray = new JSONArray();
						JSONArray projectsArray = new JSONArray();
						
						for (int i = 0; i < requestDataResult.length(); i++) {
							RequestObject ro = requestDataResult.get(i);
							requestsArray.set(requestsArray.size(), ro.toJSONObject());
						}
						
						for (int i = 0; i < projectDataResult.length(); i++) {
							ProjectObject pd = projectDataResult.get(i);
							projectsArray.set(projectsArray.size(), pd.toJSONObject());
						}
						
						JSONObject result = new JSONObject();
						result.put("projects", projectsArray);
						result.put("requests", requestsArray);

						callback.onResult(createDownloadData(result.toString()));
					}

					@Override
					public void onError(Throwable e) {
						if (RestClient.isDebug()) {
							Log.error("Unable to collect requests data :/", e);
						}
						StatusNotification.notify("Unable to collect requests data :/", StatusNotification.TIME_MEDIUM);
						GoogleAnalytics.sendException("ImportExportActivity::prepareDataToFile::Unable to collect requests data::" + e.getMessage());
						GoogleAnalyticsApp.sendException("ImportExportActivity::prepareDataToFile::Unable to collect requests data::" + e.getMessage());
					}
				});
			}

			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Unable to collect requests data :/", e);
				}
				StatusNotification.notify("Unable to collect requests data :/", StatusNotification.TIME_MEDIUM);
				GoogleAnalytics.sendException("ImportExportActivity::prepareDataToFile::Unable to collect requests data::" + e.getMessage());
				GoogleAnalyticsApp.sendException("ImportExportActivity::prepareDataToFile::Unable to collect requests data::" + e.getMessage());
			}
		});
		GoogleAnalytics.sendEvent("Settings usage", "Export data", "Generate file");
		GoogleAnalyticsApp.sendEvent("Settings usage", "Export data", "Generate file");
	}

	@Override
	public String createDownloadData(String data) {
		if (exportFileObjectUrl != null) {
			revokeDownloadData();
		}
		exportFileObjectUrl = createDownloadDataImpl(data);
		return exportFileObjectUrl;
	}

	private final native String createDownloadDataImpl(String data) /*-{
		var blob = new $wnd.Blob([ data ], {
			type : 'application/json'
		});
		return $wnd.URL.createObjectURL(blob);
	}-*/;

	@Override
	public void revokeDownloadData() {
		if (exportFileObjectUrl != null) {
			revokeDownloadDataImpl(exportFileObjectUrl);
			exportFileObjectUrl = null;
		}
	}
	/**
	 * Revoke previously set URL data. 
	 * @param url An URL to be revoked.
	 */
	private final native void revokeDownloadDataImpl(String url) /*-{
		$wnd.URL.revokeObjectURL(url);
	}-*/;

	@Override
	public String mayStop() {
		revokeDownloadData();
		return null;
	}
	/**
	 * Use external library located in libs/server.js to perform an action.
	 * @param callback
	 */
	private final native void checkServerSession() /*-{
		var context = this;
		$wnd.arc.app.server.hasSession($entry(function(result){
			context.@org.rest.client.activity.ImportExportActivity::handleSessionState(Lorg/rest/client/request/ApplicationSession;)(result);
		}));
	}-*/;
	/**
	 * A method to be called when session state change.
	 * @param session
	 */
	private void handleSessionState(ApplicationSession session){
		if(session.isError()){
			StatusNotification.notify(session.getMessage(), StatusNotification.TIME_MEDIUM);
		} else {
			if (session.getState() == ApplicationSession.CONNECTED) {
				RestClient.applicationUserId = session.getUserId();
				view.setIsUserView();
			} else {
				view.setIsNotUserView();
			}
		}
	}
	
	/**
	 * @todo: Remove it from the interface.
	 */
	@Override
	public String getApplicationUserId() {
		return RestClient.applicationUserId;
	}

	/**
	 * When clicking to "Connect" button application creates new window to login
	 * to application. When returning it will redirect user to auth.html page.
	 * This page sets chrome.storage.local "applogin" value to current time. When it
	 * done this handler should hide connect controls and show other options.
	 */
	private final native void handleSessionChange() /*-{
		if(!$wnd.arcGwtCallbacks){
			$wnd.arcGwtCallbacks = {};
		}
		var context = this;
		$wnd.arcGwtCallbacks['sessionchange'] = $entry(function(session){
			if(session === undefined) return;
			context.@org.rest.client.activity.ImportExportActivity::handleSessionState(Lorg/rest/client/request/ApplicationSession;)(session);
		});
	}-*/;

	@Override
	public void serverStoreAction() {
		DataExportImpl impl = new DataExportImpl();
		impl.setEventBus(eventBus);
		impl.synch();
		GoogleAnalytics.sendEvent("Settings usage", "Export data", "To server");
		GoogleAnalyticsApp.sendEvent("Settings usage", "Export data", "To server");
	}

	@Override
	public void doServerImport(String[] keys) {
		if (keys.length == 0) {
			StatusNotification.notify("You must select items to import", StatusNotification.TIME_SHORT);
			return;
		}
		importData(keys, new ImportDataCallback() {
			@Override
			public void onSuccess(final JsArray<RequestDataJso> result) {
				int size = result.length();
				if (size == 0) {
					StatusNotification.notify("Something went wrong. There is no data to save", StatusNotification.TIME_MEDIUM);
					GoogleAnalytics.sendException("ImportExportActivity::doServerImport::There is no data to save");
					GoogleAnalyticsApp.sendException("ImportExportActivity::doServerImport::There is no data to save");
					return;
				}
				ArrayList<RequestObject> importData = new ArrayList<RequestObject>();
				String[] geaKeys = new String[size];
				for(int i=0; i<size; i++){
					RequestDataJso obj = result.get(i);
					importData.add(RequestObject.fromImportData(obj));
					geaKeys[i] = obj.getKey();
				}
				saveImported(importData, geaKeys);
			}
			@Override
			public void onFailure(String message) {
				StatusNotification.notify(message, StatusNotification.TIME_MEDIUM);
				GoogleAnalytics.sendException("ImportExportActivity::doServerImport::Failure handler::" + message);
				GoogleAnalyticsApp.sendException("ImportExportActivity::doServerImport::Failure handler::" + message);
				
			}
		});
		GoogleAnalytics.sendEvent("Settings usage", "Import data", "Download from server");
		GoogleAnalyticsApp.sendEvent("Settings usage", "Import data", "Download from server");
	}
	
	/**
	 * Import data from server using JSNI and method located in libs/app.request.js
	 * @param keys An array of keys to be imported
	 * @param callback Function to be called after import.
	 */
	private final static native void importData(final String[] keys, final ImportDataCallback callback) /*-{
		$wnd.arc.app.server.getImportData(keys, $entry(function(result){
			if(result.error){
				callback.@org.rest.client.request.ImportDataCallback::onFailure(Ljava/lang/String;)(result.message);
			} else {
				callback.@org.rest.client.request.ImportDataCallback::onSuccess(Lcom/google/gwt/core/client/JsArray;)(result);
			}
		}));
	}-*/;
	/**
	 * Save imported data into Database.
	 * @param importData Array to save
	 * @param original
	 */
	private void saveImported(final ArrayList<RequestObject> importData, final String[] geaKeys){
		@SuppressWarnings("unchecked")
		JsArray<RequestObject> arr = (JsArray<RequestObject>) JsArray.createArray();
		for (int i = 0; i < importData.size(); i++) {
			arr.set(arr.length(), importData.get(i));
		}
		
		clientFactory.getRequestDataStore().importRequests(arr, new RequestDataStoreWebSql.StoreInsertListCallback() {
			@Override
			public void onError(Throwable error) {
				StatusNotification.notify("Unable to save data to local database :(",
						StatusNotification.TIME_MEDIUM);
				if (RestClient.isDebug()) {
					Log.error("Unable to save data to local database :(", error);
				}
				GoogleAnalytics.sendException("ImportExportActivity::saveImported::Failure handler::" + error);
				GoogleAnalyticsApp.sendException("ImportExportActivity::saveImported::Failure handler::" + error);
			}
			@Override
			public void onSuccess(JsArrayInteger rowIds) {
				ArrayList<ExportedDataInsertItem> exported = new ArrayList<ExportedDataInsertItem>();
				int size = rowIds.length();
				for (int i = 0; i<size; i++) {
					int dbId = rowIds.get(i);
					ExportedDataInsertItem item = new ExportedDataInsertItem(geaKeys[i]);
					item.setReferenceId(dbId);
					item.setType("form");
					exported.add(item);
				}
				saveImportedReferences(exported);
			}
		});
	}
	/**
	 * Save reference to the AppEngine database in keys storage.
	 * @param exported
	 */
	private void saveImportedReferences(ArrayList<ExportedDataInsertItem> exported){
		clientFactory.getExportedDataReferenceService().insertExported(exported, new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				if (RestClient.isDebug()) {
					Log.error("Unable to insert imported references. During export duplicates may occur.",error);
				}
				StatusNotification.notify("Data restored with some errors", StatusNotification.TIME_MEDIUM);
				view.resetServerView();
				GoogleAnalytics.sendException("ImportExportActivity::saveImportedReferences::Failure handler::" + error.getMessage());
				GoogleAnalyticsApp.sendException("ImportExportActivity::saveImportedReferences::Failure handler::" + error.getMessage());
			}

			@Override
			public void onSuccess() {
				StatusNotification.notify("Data restored", StatusNotification.TIME_MEDIUM);
				view.resetServerView();
			}
		});
	}
	
	
	/**
	 * Called when the user select a file to import data from.
	 * This method will parse the file and result with import data.
	 */
	@Override
	public void importFromFile(File file) {
		FileReader reader = FileReader.create();
		reader.addErrorHandler(new ErrorHandler() {
			@Override
			public void onError(File file, FileError error) {
				String msg = "";
				switch (error.getCode()) {
				case FileError.ABORT_ERR:
					msg += " ABORT_ERR::";
					break;
				case FileError.ENCODING_ERR:
					msg += " ENCODING_ERR::";
					break;
				case FileError.NOT_FOUND_ERR:
					msg += " NOT_FOUND_ERR::";
					break;
				case FileError.NOT_READABLE_ERR:
					msg += " NOT_READABLE_ERR::";
					break;
				case FileError.SECURITY_ERR:
					msg += " SECURITY_ERR::";
					break;
				}
				msg += " Unable read file.";
				if (RestClient.isDebug()) {
					Log.error(msg + " Error code: " + error.getCode());
				}
				StatusNotification.notify(msg, StatusNotification.TIME_MEDIUM);
				view.resetImportView();
				GoogleAnalytics.sendException("ImportExportActivity::importFromFile::FileReader::" + msg);
				GoogleAnalyticsApp.sendException("ImportExportActivity::importFromFile::FileReader::" + msg);
			}
		});
		reader.addLoadHandler(new LoadHandler() {
			@Override
			public void onLoad(File file) {
				String data = file.getResult();
				ImportParser parser = new ImportParser(data);
				parser.parse(new ImportParser.ImportParserHandler() {

					@Override
					public void onParse(ImportResult result) {
						if (result == null) {
							StatusNotification.notify("Unable to parse input file.", StatusNotification.TIME_MEDIUM);
							return;
						}
						view.showImportTable(result);
					}

					@Override
					public void onError(Throwable e) {
						StatusNotification.notify(e.getMessage(), StatusNotification.TIME_MEDIUM);
						view.resetImportView();
					}
				});

			}
		});
		reader.readAsText(file);
	}
	@Override
	public void saveImportedFileData(ImportResult data, final Callback<Boolean, Void> callback) {
		final JsArray<ProjectObject> projects = data.getProjects();
		final JsArray<RequestObject> requests = data.getRequests();

		if (projects != null && projects.length() > 0) {

			//
			// First, save projects data and update referenced requests
			//
			
			clientFactory.getProjectsStore().importData(projects, new ProjectStoreWebSql.StoreInsertListCallback() {

				@Override
				public void onError(Throwable error) {
					if (RestClient.isDebug()) {
						Log.error("Unable insert project data", error);
					}
					GoogleAnalytics.sendException("ImportExportActivity::saveImportedFileData::Service error handler::" + error.getMessage());
					GoogleAnalyticsApp.sendException("ImportExportActivity::saveImportedFileData::Service error handler::" + error.getMessage());
					callback.onSuccess(false);
				}

				@Override
				public void onSuccess(JsArrayInteger rowIds) {

					for (int i = 0, len = rowIds.length(); i < len; i++) {
						int currentProjectId = rowIds.get(i);
						int exportedProjectId = projects.get(i).getId();
						// now find all request where project ID is
						// "exportedProjectId" as an old ID and replace
						// it with new one.
						int requestsSize = requests.length();
						for (int j=0; j<requestsSize; j++) {
							RequestObject r = requests.get(j);
							if (r.getProject() == exportedProjectId) {
								r.setProject(currentProjectId);
							}
						}
					}
					saveImportedFileData(requests, callback);
				}
			});
		} else {
			saveImportedFileData(requests, callback);
		}
	}

	private void saveImportedFileData(JsArray<RequestObject> requests, final Callback<Boolean, Void> callback) {
		if (requests == null || requests.length() == 0) {
			if (RestClient.isDebug()) {
				Log.error("Request data is emnpty.");
			}
			callback.onSuccess(false);
			return;
		}
		
		clientFactory.getRequestDataStore().importRequests(requests, new RequestDataStoreWebSql.StoreInsertListCallback() {

			@Override
			public void onError(Throwable error) {
				if (RestClient.isDebug()) {
					Log.error("Unable insert requests data", error);
				}
				GoogleAnalytics.sendException("ImportExportActivity::saveImportedFileData2::Service error handler::" + error.getMessage());
				GoogleAnalyticsApp.sendException("ImportExportActivity::saveImportedFileData2::Service error handler::" + error.getMessage());
				callback.onSuccess(false);
			}

			@Override
			public void onSuccess(JsArrayInteger rowIds) {
				callback.onSuccess(true);
			}
		});
		GoogleAnalytics.sendEvent("Settings usage", "Import data", "From file");
		GoogleAnalyticsApp.sendEvent("Settings usage", "Import data", "From file");
	}

	@Override
	public final native void requestImportSuggestions(String uid) /*-{
		var context = this;
		$wnd.arc.app.server.getImportSuggestions(uid, $entry(function(result){
			context.@org.rest.client.activity.ImportExportActivity::onDownloadSuggestionsReady(Lorg/rest/client/request/RequestImportListObject;)(result);
		}));
	}-*/;
	/**
	 * Called when the app download stored data from the server.
	 * @param list
	 */
	public void onDownloadSuggestionsReady(RequestImportListObject list){ // NO_UCD (unused code)
		if(list.isError()){
			StatusNotification.notify(list.getMessage(), StatusNotification.TIME_MEDIUM);
			view.resetServerView();
			return;
		}
		view.showServerImportTable(list.getItems());
	}
}
