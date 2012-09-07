/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
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

import java.util.logging.Level;
import java.util.logging.Logger;

import org.rest.client.event.ApplicationReadyEvent;
import org.rest.client.event.NewProjectAvailableEvent;
import org.rest.client.mvp.AppActivityMapper;
import org.rest.client.mvp.AppPlaceHistoryMapper;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.RequestParameters;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.RequestDataStoreWebSql;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.task.CreateMenuTask;
import org.rest.client.task.FirstRunTask;
import org.rest.client.task.InitializeAppHandlersTask;
import org.rest.client.task.InitializeDatabaseTask;
import org.rest.client.task.TasksLoader;
import org.rest.client.ui.RequestView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.activity.shared.ActivityManager;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.GWT.UncaughtExceptionHandler;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.place.shared.PlaceHistoryHandler;
import com.google.gwt.storage.client.Storage;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class RestClient implements EntryPoint {

	private Place defaultPlace = new RequestPlace(null);
	private SimplePanel appWidget = new SimplePanel();
	private static final Logger log = Logger.getLogger(RestClient.class
			.getName());
	private final static ClientFactory clientFactory = GWT
			.create(ClientFactory.class);

	public final static ClientFactory getClientFactory() {
		return clientFactory;
	}
	
	private static int currentOpenedProject = -1;
	private static int previousOpenedProject = -1;
	/**
	 * @return current opened project ID or -1 if none
	 */
	public final static int getOpenedProject(){
		return currentOpenedProject;
	}
	/**
	 * @return previously opened project ID or -1 if none
	 */
	public final static int getPreviousProject(){
		return previousOpenedProject;
	}
	/**
	 * @param project current opened project ID or -1 if none
	 */
	public final static void setOpenedProject(int project){
		currentOpenedProject = project;
	}
	/**
	 * 
	 * @param project previously opened project ID or -1 if none
	 */
	public final static void setPreviousProject(int project){
		previousOpenedProject = project;
	}
	

	public void onModuleLoad() {
		
		GWT.setUncaughtExceptionHandler(new UncaughtExceptionHandler() {
			@Override
			public void onUncaughtException(Throwable e) {
				log.log(Level.SEVERE, e.getMessage(), e);
				Log.error("Application error", e);
			}
		});
		
		Logger.getLogger("").addHandler(clientFactory.getErrorDialogView().getHandler());
		Logger.getLogger("").setLevel(Level.WARNING);
		
		final EventBus eventBus = clientFactory.getEventBus();
		PlaceController placeController = clientFactory.getPlaceController();
		// Start ActivityManager for the main widget with our ActivityMapper
		ActivityMapper activityMapper = new AppActivityMapper(clientFactory);
		ActivityManager activityManager = new ActivityManager(activityMapper,
				eventBus);
		activityManager.setDisplay(appWidget);

		// Start PlaceHistoryHandler with our PlaceHistoryMapper
		AppPlaceHistoryMapper historyMapper = GWT
				.create(AppPlaceHistoryMapper.class);
		final PlaceHistoryHandler historyHandler = new PlaceHistoryHandler(
				historyMapper);
		historyHandler.register(placeController, eventBus, defaultPlace);

		AppResources.INSTANCE.appCss().ensureInjected();
		
		
		//
		// Start up application. 
		//
		
		TasksLoader.addTask(new InitializeDatabaseTask());
		TasksLoader.addTask(new FirstRunTask());
		TasksLoader.addTask(new InitializeAppHandlersTask());
		TasksLoader.addTask(new CreateMenuTask());
		
		TasksLoader.runTasks(new Callback<Void, Void>() {

			@Override
			public void onFailure(Void reason) {
				Log.error("Initialize error...");
			}

			@Override
			public void onSuccess(Void result) {
				RootPanel.get("appContainer").add(appWidget);
				historyHandler.handleCurrentHistory();
				fixChromeLayout();
				eventBus.fireEvent(new ApplicationReadyEvent());
			}
		});
	}
	
	private static Boolean appDebug = null;
	
	/**
	 * 
	 * @return true if debug output is enabled, false otherwise
	 */
	public static boolean isDebug() {
		if(appDebug == null){
			Storage store = Storage.getLocalStorageIfSupported();
			if(store == null){
				appDebug = true;
			} else {
				String result = store.getItem(LocalStore.DEBUG_KEY);
				if(result != null && result.equals("true")){
					appDebug = true;
				} else {
					appDebug = false;
				}
			}
		}
		return appDebug;
	}
	
	public static void setDebug(boolean debug){
		appDebug = debug;
	}
	
	private static Boolean appHistoryEnabled = null;
	/**
	 * @return true if history feature output is enabled, false otherwise
	 */
	public static boolean isHistoryEabled(){
		if(appHistoryEnabled == null){
			Storage store = Storage.getLocalStorageIfSupported();
			if(store == null){
				appHistoryEnabled = true;
			} else {
				String result = store.getItem(LocalStore.HISTORY_KEY);
				if(result == null || result.equals("true")){
					appHistoryEnabled = true;
				} else {
					appHistoryEnabled = false;
				}
			}
		}
		return appHistoryEnabled;
	}
	
	public static void setHistoryEnabled(boolean historyEnabled){
		appHistoryEnabled = historyEnabled;
	}

	/**
	 * Get request data from current form. If current view is not request view
	 * it will get data from storage, from latest request.
	 * 
	 * @param callback
	 */
	public static void collectRequestData(
			final Callback<RequestObject, Throwable> callback) {
		final RequestObject requestObject = RequestObject.createRequest();
		if (History.getToken().isEmpty() || History.getToken().startsWith("RequestPlace")) {
			RequestView requestView = RestClient.getClientFactory()
					.getRequestView();
			requestObject.setEncoding(requestView.getEncoding());
			requestObject.setHeaders(requestView.getHeaders());
			requestObject.setMethod(requestView.getMethod());
			requestObject.setPayload(requestView.getPayload());
			requestObject.setURL(requestView.getUrl());
			requestObject.setFiles(requestView.getFiles());
			callback.onSuccess(requestObject);
		} else {
			RequestParameters
					.restoreLatest(new Callback<RequestParameters, Throwable>() {
						@Override
						public void onSuccess(RequestParameters result) {
							requestObject.setEncoding(result.getFormEncoding());
							requestObject.setHeaders(result.getHeaders());
							requestObject.setMethod(result.getMethod());
							requestObject.setPayload(result.getPostData());
							requestObject.setURL(result.getRequestUrl());
							callback.onSuccess(requestObject);
						}

						@Override
						public void onFailure(Throwable caught) {
							callback.onFailure(caught);
						}
					});
		}
	}
	/**
	 * Save to Store Request form data. This method is used when creating new project.
	 * @param obj Object data to save
	 * @param newProjectName Project name to save
	 * @param callback
	 */
	public static void saveRequestData(final RequestObject obj, final String newProjectName, final Callback<RequestObject, Throwable> callback){
		final ProjectStoreWebSql store = clientFactory.getProjectsStore();
		ProjectObject project = ProjectObject.create();
		project.setName(newProjectName);
		store.put(project, null, new StoreResultCallback<Integer>() {

			@Override
			public void onSuccess(Integer result) {
				obj.setProject(result.intValue());
				saveRequestData(obj, callback);
				clientFactory.getEventBus().fireEvent(new NewProjectAvailableEvent(result.intValue()));
			}

			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to save project data. Can't save project to store.", e);
				}
				callback.onFailure(e);
			}
		});
	}
	/**
	 * Save new request data.
	 * @param obj
	 * @param callback
	 */
	public static void saveRequestData(final RequestObject obj, final Callback<RequestObject, Throwable> callback){
		final RequestDataStoreWebSql store = clientFactory.getRequestDataStore();
		
		store.put(obj, null, new StoreResultCallback<Integer>() {
			
			@Override
			public void onSuccess(Integer result) {
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
	
	/**
	 * Sometimes chrome freeze after layout change via javascript (not sure if is it).
	 * Use this after operations when it's happen.
	 */
	public static final native void fixChromeLayout() /*-{
		$doc.body.style.display = 'none';
		$wnd.setTimeout(function() {
			$doc.body.style.removeProperty('display');
		}, 15);
	}-*/;
}
