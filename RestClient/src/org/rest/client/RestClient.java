/*******************************************************************************
 * Copyright 2012 Pawel Psztyc
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client;

import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;

import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.event.ApplicationReadyEvent;
import org.rest.client.event.NewProjectAvailableEvent;
import org.rest.client.event.SavedRequestEvent;
import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.mvp.AppActivityMapper;
import org.rest.client.mvp.AppPlaceHistoryMapper;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.FilesObject;
import org.rest.client.request.HttpMethodOptions;
import org.rest.client.request.RequestHeadersParser;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.RequestDataStoreWebSql;
import org.rest.client.storage.store.StoreKeys;
import org.rest.client.task.CreateMenuTask;
import org.rest.client.task.InitializeAppHandlersTask;
import org.rest.client.task.SetSyncDataTask;
import org.rest.client.task.TasksLoader;
import org.rest.client.ui.RequestView;
import org.rest.client.util.UUID;

import com.google.gwt.activity.shared.ActivityManager;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.place.shared.PlaceHistoryHandler;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.gwt.xhr2.client.RequestHeader;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Entry point for the app. This class will initialize event handlers, task
 * workers and will call history state change event so the app will run on
 * requested entry point.
 */
public class RestClient implements EntryPoint {
	/**
	 * A flag which determine if application is in initializing state. If set to
	 * false means the app is fully loaded.
	 */
	private static boolean initializing = true;
	/**
	 * A default place in the app. By default Request view is displayed. To
	 * change this behavior change default place class.
	 * 
	 * @TODO: determine if this field shouldn't be a method variable (since it
	 *        is used in one method only)
	 */
	private Place defaultPlace = new RequestPlace(null);
	/**
	 * App's main widget - a placeholder for all widgets.
	 * 
	 * @TODO: determine if this field shouldn't be a method variable (since it
	 *        is used in one method only)
	 */
	private SimplePanel appWidget = new SimplePanel();
	/**
	 * Logger object to console output.
	 */
	private static final Logger log = Logger.getLogger(RestClient.class.getName());
	/**
	 * Client factory instance. It will be initialized automatically by the
	 * framework. Client factory implementation class is set in .gwt.xml config
	 * file and implementation can vary depending on set conditions. This app
	 * uses only one implementation.
	 */
	private final static ClientFactory clientFactory = GWT.create(ClientFactory.class);

	/**
	 * App's client factory implementation. It has reference to all important
	 * app's services and views.
	 * 
	 * @return Current client factory implementation.
	 */
	public final static ClientFactory getClientFactory() {
		return clientFactory;
	}

	/**
	 * ID of currently opened project. By default it's value is -1.
	 */
	public static int currentlyOpenedProject = -1;
	/**
	 * ID if previously opened project.
	 * 
	 * @TODO: it should be array (list) of all opened projects. Last added
	 *        project is current one. If current is -1 the it means no project
	 *        is opened.
	 */
	public static int previouslyOpenedProject = -1;
	/**
	 * This app generates UUID for all users and synchronize it between app's
	 * instances on different machines. It can be used for tracking (GA)
	 * purposes or to sync settings.
	 * 
	 * @TODO: This is old way to keep tracking of a user to synchronize setting.
	 *        The app should use sync storage or sync filesystem to synchronize
	 *        settings.
	 */
	public static String applicationUserId = null;
	/**
	 * Flag determining if save dialog is opened. True if it is.
	 */
	public static boolean isSaveDialogEnabled = false;
	/**
	 * Previously sessionStorage has been used to keep this information. This
	 * will keep an information about restored request database ID.
	 */
	public static Integer RESTORED_REQUEST = null;
	/**
	 * Previously sessionStorage has been used to keep this information. ID of
	 * restored Google Drive item.
	 */
	public static String CURRENT_GOOGLE_DRIVE_ITEM = null;
	/**
	 * Previously sessionStorage has been used to keep this information. Id of
	 * the parent folder where the item has been created.
	 */
	public static String GOOGLE_DRIVE_CREATE_FOLDER_ID = null;
	/**
	 * Previously sessionStorage has been used to keep this information. Id of
	 * the parent folder where the item has been created.
	 */
	public static String GOOGLE_DRIVE_CREATE_USER_ID = null;

	/**
	 * Main method and entry point to the app.
	 */
	public void onModuleLoad() {
		GoogleAnalyticsApp.initialize();
		GoogleAnalytics.initialize();
		exportCollectRequestData();
		Log.exportSetTrace();
		
		setLogging();
		
		// app's main event bus. It's used to distribute events in the app.
		EventBus eventBus = clientFactory.getEventBus();
		PlaceController placeController = clientFactory.getPlaceController();
		// Start ActivityManager for the main widget with the ActivityMapper
		ActivityMapper activityMapper = new AppActivityMapper(clientFactory);
		ActivityManager activityManager = new ActivityManager(activityMapper, eventBus);
		// TODO: set id or class name and use CSS instead
		appWidget.setStyleName("app-widget");
		activityManager.setDisplay(appWidget);
		// Create an instance for history mapper. It will map places with
		// history state.
		AppPlaceHistoryMapper historyMapper = GWT.create(AppPlaceHistoryMapper.class);
		PlaceHistoryHandler historyHandler = new PlaceHistoryHandler(historyMapper);
		historyHandler.register(placeController, eventBus, defaultPlace);

		runTasksQueue(historyHandler);
	}

	/**
	 * Set logging properties. The app will catch all uncaughted exceptions and
	 * present it to the user if nescesary.
	 */
	private void setLogging() {
		/*GWT.setUncaughtExceptionHandler(new UncaughtExceptionHandler() {
			@Override
			public void onUncaughtException(Throwable e) {
				log.log(Level.SEVERE, e.getMessage(), e);
				Log.error("Application error", e);
				GoogleAnalytics.sendException("RestClient::Application error::" + e.getMessage());
				GoogleAnalyticsApp.sendException("RestClient::Application error::" + e.getMessage());
			}
		});*/

		Logger.getLogger("").addHandler(clientFactory.getErrorDialogView().getHandler());
		Logger.getLogger("").setLevel(Level.ALL);
	}

	/**
	 * Run initialization tasks. Tasks class will handle showing, hiding and
	 * updating status in loading screen. See {@link TasksLoader} class
	 * description for more information.
	 */
	private void runTasksQueue(final PlaceHistoryHandler historyHandler) {
		TasksLoader.addTask(new SetSyncDataTask());
		TasksLoader.addTask(new InitializeAppHandlersTask());
		// @TODO: is menu must be created dynamically?
		TasksLoader.addTask(new CreateMenuTask());
		TasksLoader.runTasks(new Callback<Void, Void>() {

			@Override
			public void onFailure(Void reason) {
				Log.error("Initialize error... Check previous errors for cause.");
			}

			@Override
			public void onSuccess(Void result) {
				RootPanel.get("appContainer").add(appWidget);
				//
				// Special Tokens
				// import/{UID} import data from Applications server
				// TODO: to be removed on December 1st, 2012
				//
				if (Window.Location.getHash().startsWith("#import/")) {
					String importUID = Window.Location.getHash().substring(8);
					clientFactory.getPlaceController().goTo(ImportExportPlace.fromServerImport(importUID));
				} else {
					historyHandler.handleCurrentHistory();
				}
				fixChromeLayout();
				clientFactory.getEventBus().fireEvent(new ApplicationReadyEvent());
				initializing = false;
			}
		});
	}

	/**
	 * Synchronized between app's instances debug state.
	 * 
	 * @return true if debug output is enabled, false otherwise
	 */
	public static boolean isDebug() {
		return SyncAdapter.debug;
	}

	/**
	 * Set and sync debug options status.
	 * 
	 * @param debug
	 */
	public static void setDebug(boolean debug) {
		SyncAdapter.debug = debug;
	}

	/**
	 * @return true if history feature output is enabled, false otherwise
	 */
	static boolean isHistoryEabled() {
		return SyncAdapter.history;
	}

	

	/**
	 * Get request data from current form. If current view is not request view
	 * it will get data from storage, from latest request.
	 * 
	 * @param callback
	 */
	public static void collectRequestData(final Callback<RequestObject, Throwable> callback) {

		if (History.getToken().isEmpty() || History.getToken().startsWith("RequestPlace")) {
			RequestView requestView = RestClient.getClientFactory().getRequestView();

			RequestObject rp = RequestObject.createRequest();
			rp.setFiles(requestView.getFiles());
			rp.setHeaders(requestView.getHeaders());
			rp.setMethod(requestView.getMethod());
			rp.setPayload(requestView.getPayload());
			rp.setURL(requestView.getUrl());
			rp.setName(requestView.getRequestName());

			callback.onSuccess(parseRequestParameters(rp));
		} else {
			RequestObject.restoreLatest(new Callback<RequestObject, Throwable>() {
				@Override
				public void onSuccess(RequestObject result) {
					callback.onSuccess(parseRequestParameters(result));
				}

				@Override
				public void onFailure(Throwable caught) {
					callback.onFailure(caught);
				}
			});
		}
	}

	public static final void collectRequestData(final Object callback) { // NO_UCD (unused code)
		collectRequestData(new Callback<RequestObject, Throwable>() {

			@Override
			public void onSuccess(RequestObject result) {
				callback(callback, result);
			}

			@Override
			public void onFailure(Throwable reason) {
				callback(callback, reason);
			}
		});

	}

	private final static native void callback(Object callback, Object... params) /*-{
		callback(params);
	}-*/;

	private final native void exportCollectRequestData() /*-{
		$wnd.RestClient = $wnd.RestClient || {};
		$wnd.RestClient.collectRequestData = function(callback) {
			@org.rest.client.RestClient::collectRequestData(Ljava/lang/Object;)(function(){
				var params = Array.from(arguments);
				callback(params);
			});
		};
	}-*/;

	/**
	 * Prepare request data. It set (if request include payload) content-type
	 * header according to user preferences
	 * 
	 * @param rp
	 * @return
	 */
	private static RequestObject parseRequestParameters(RequestObject rp) {
		String headers = rp.getHeaders();
		String method = rp.getMethod();
		String encoding = rp.getEncoding();
		boolean hasPayload = HttpMethodOptions.hasBody(method);

		ArrayList<FilesObject> files = null;
		if (hasPayload) {
			// handle content-type header for request with payload.
			// It can be either set via headers form or select input with
			// predefined options.
			ArrayList<RequestHeader> headersList = RequestHeadersParser.stringToHeaders(headers);
			if (headers == null) {
				headersList = new ArrayList<RequestHeader>();
			}
			int i = 0;
			for (RequestHeader item : headersList) {
				String key = item.getName();
				if (key.toLowerCase().equals("content-type")) {
					encoding = item.getValue();
					if (RestClient.isDebug()) {
						Log.debug("Found Content-Type header in headers list. Overwrite content-type value to ", encoding);
					}
					// Temporarily remove it from headers list
					headersList.remove(i);
					break;
				}
				i++;
			}
			files = rp.getFiles();
			if (files != null && files.size() > 0) {
				encoding = null;
			}
			if (encoding != null) {
				headersList.add(new RequestHeader("Content-Type", encoding));
			}
			headers = RequestHeadersParser.headersListToString(headersList);

		}

		RequestObject requestObject = RequestObject.createRequest();
		requestObject.setHeaders(headers);
		requestObject.setMethod(method);
		String url = rp.getURL();
		if (url.startsWith("/") && !isProdMode()) {
			//
			// DEV mode.
			//
			url = "http://127.0.0.1:8888" + url;
		}

		requestObject.setURL(url);
		if (hasPayload) {
			requestObject.setPayload(rp.getPayload());
			requestObject.setFiles(files);
		}
		return requestObject;
	}

	private static final native boolean isProdMode() /*-{
		return !(location.hostname === '127.0.0.1');
	}-*/;

	/**
	 * Save to Store Request form data. This method is used when creating new
	 * project.
	 * 
	 * @param obj
	 *            Object data to save
	 * @param newProjectName
	 *            Project name to save
	 * @param callback
	 */
	public static void saveRequestData(final RequestObject obj, final String newProjectName,
			final Callback<RequestObject, Throwable> callback) {
		final ProjectStoreWebSql store = clientFactory.getProjectsStore();
		ProjectObject project = ProjectObject.create();
		project.setName(newProjectName);

		store.add(project, new ProjectStoreWebSql.StoreInsertCallback() {

			@Override
			public void onSuccess(int result) {
				obj.setProject(result);
				clientFactory.getEventBus().fireEvent(new NewProjectAvailableEvent(result));
				saveRequestData(obj, callback);
			}

			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Unable to save project data. Can't save project to store.", e);
				}
				callback.onFailure(e);
			}
		});
	}

	/**
	 * Save new request data.
	 * 
	 * @param obj
	 * @param callback
	 */
	public static void saveRequestData(final RequestObject obj, final Callback<RequestObject, Throwable> callback) {
		final RequestDataStoreWebSql store = clientFactory.getRequestDataStore();
		if (obj.getId() > 0) {
			store.update(obj, new RequestDataStoreWebSql.StoreSimpleCallback() {
				@Override
				public void onSuccess() {
					clientFactory.getEventBus().fireEvent(new SavedRequestEvent(obj));
					callback.onSuccess(obj);
				}

				@Override
				public void onError(Throwable e) {
					if (RestClient.isDebug()) {
						Log.error("Unable to save request data. Can't save request to store.", e);
					}
					callback.onFailure(e);
				}
			});
		} else {
			store.insert(obj, new RequestDataStoreWebSql.StoreInsertCallback() {
				@Override
				public void onSuccess(int inserId) {
					obj.setId(inserId);
					clientFactory.getEventBus().fireEvent(new SavedRequestEvent(obj));
					callback.onSuccess(obj);
				}
				
				@Override
				public void onError(Throwable e) {
					if(RestClient.isDebug()){
						Log.error("Unable to save request data. Can't save request to store.", e);
					}
					callback.onFailure(e);
				}
			});
		}

	}

	/**
	 * Get application unique ID (36 characters).
	 * 
	 * @return generated RFC4122 UUID
	 */
	public static void getAppId(final Callback<String, Throwable> callback) {
		final Storage store = GWT.create(Storage.class);
		JSONObject jo = new JSONObject();
		try {
			jo.put(StoreKeys.APPLICATION_ID, new JSONString("null"));
		} catch (Exception e) {
		}

		store.getLocal().get(jo.getJavaScriptObject(), new StorageArea.StorageItemsCallback() {

			@Override
			public void onError(String message) {
				callback.onFailure(new Throwable(message));
			}

			@Override
			public void onResult(JavaScriptObject data) {
				StorageResult<String> obj = data.cast();
				String uuid = obj.get(StoreKeys.APPLICATION_ID);
				if (uuid == null || uuid.equals("null")) {
					uuid = UUID.uuid();
					JSONObject jo = new JSONObject();
					try {
						jo.put(StoreKeys.APPLICATION_ID, new JSONString(uuid));
					} catch (Exception e) {
					}
					final String _saveUuid = uuid;
					store.getLocal().set(jo.getJavaScriptObject(), new StorageSimpleCallback() {

						@Override
						public void onError(String message) {
							callback.onFailure(new Throwable(message));
						}

						@Override
						public void onDone() {
							callback.onSuccess(_saveUuid);
						}
					});
				} else {
					callback.onSuccess(uuid);
				}
			}
		});
	}

	/**
	 * Sometimes chrome freeze after layout change via javascript (just
	 * guessing). Use this after operations when it's happen.
	 */
	public static final native void fixChromeLayout() /*-{
														$doc.body.style.display = 'none';
														$wnd.setTimeout(function() {
														$doc.body.style.removeProperty('display');
														}, 15);
														}-*/;
}
