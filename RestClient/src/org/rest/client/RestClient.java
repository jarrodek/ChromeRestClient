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

import org.rest.client.event.ApplicationReadyEvent;
import org.rest.client.load.TasksLoader;
import org.rest.client.mvp.AppActivityMapper;
import org.rest.client.mvp.AppPlaceHistoryMapper;
import org.rest.client.place.RequestPlace;
import org.rest.client.request.RequestParameters;
import org.rest.client.resources.AppResources;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.ProjectsStore;
import org.rest.client.storage.store.RequestDataStore;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.storage.store.objects.RequestObject;
import org.rest.client.task.CreateMenuTask;
import org.rest.client.task.InitialConfigTask;
import org.rest.client.task.InitializeAppHandlersTask;
import org.rest.client.ui.RequestView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.activity.shared.ActivityManager;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.place.shared.PlaceHistoryHandler;
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
	private final static ClientFactory clientFactory = GWT
			.create(ClientFactory.class);

	public final static ClientFactory getClientFactory() {
		return clientFactory;
	}

	public void onModuleLoad() {

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

		//
		// Register external events
		//
		ExternalEventsFactory.init(eventBus);

		// Add initial tasks like load configuration or restore state
		CreateMenuTask createMenuTask = new CreateMenuTask();
		InitialConfigTask initTask = new InitialConfigTask();
		InitializeAppHandlersTask appHandlersTask = new InitializeAppHandlersTask();

		TasksLoader.addTask(initTask);
		TasksLoader.addTask(createMenuTask);
		TasksLoader.addTask(appHandlersTask);
		// run loaded tasks and show app view.
		TasksLoader.runTasks(new Callback<Void, Void>() {
			@Override
			public void onSuccess(Void result) {
				RootPanel.get("appContainer").add(appWidget);
				historyHandler.handleCurrentHistory();
				fixChromeLayoutIssue();
				eventBus.fireEvent(new ApplicationReadyEvent());
			}

			@Override
			public void onFailure(Void reason) {
				Log.error("Initialize error...");
				RootPanel.get("appContainer").add(appWidget);
				// historyHandler.handleCurrentHistory();
				// eventBus.fireEvent(new ApplicationReadyEvent());
			}
		});

		AppResources.INSTANCE.appCss().ensureInjected();
	}

	public static boolean isDebug() {
		return true;
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
		if (History.getToken().startsWith("RequestPlace")) {
			RequestView requestView = RestClient.getClientFactory()
					.getRequestView();
			requestObject.setEncoding(requestView.getEncoding());
			requestObject.setHeaders(requestView.getHeaders());
			requestObject.setMethod(requestView.getMethod());
			requestObject.setPayload(requestView.getPayload());
			requestObject.setURL(requestView.getUrl());
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
		final ProjectsStore store = clientFactory.getProjectsStore();
		store.open(new StoreResultCallback<Boolean>() {
			
			@Override
			public void onSuccess(Boolean result) {
				ProjectObject project = ProjectObject.create();
				project.setName(newProjectName);
				store.put(project, new StoreResultCallback<Long>() {
					
					@Override
					public void onSuccess(Long result) {
						obj.setProject(result.intValue());
						saveRequestData(obj, callback);
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
			
			@Override
			public void onError(Throwable e) {
				if(RestClient.isDebug()){
					Log.error("Unable to save project data. Can't open project's store.", e);
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
		final RequestDataStore store = clientFactory.getRequestDataStore();
		store.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean res) {
				store.put(obj, new StoreResultCallback<Long>() {
					@Override
					public void onSuccess(Long result) {
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
			
			@Override
			public void onError(Throwable e) {
				callback.onFailure(e);
			}
		});
	}
	
	/**
	 * @todo: report an issue. snap in /var/www/a/war/
	 */
	private final native void fixChromeLayoutIssue() /*-{
		$doc.body.style.display = 'none';
		$wnd.setTimeout(function() {
			$doc.body.style.removeProperty('display');
		}, 25);
	}-*/;
}
