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
import org.rest.client.resources.AppResources;
import org.rest.client.task.CreateMenuTask;
import org.rest.client.task.InitialConfigTask;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.activity.shared.ActivityManager;
import com.google.gwt.activity.shared.ActivityMapper;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.GWT;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.place.shared.PlaceHistoryHandler;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.SimplePanel;
import com.google.web.bindery.event.shared.EventBus;

/**
 * Entry point classes define <code>onModuleLoad()</code>.
 */
public class RestClient implements EntryPoint {
	
	private Place defaultPlace = new RequestPlace(null);
	private SimplePanel appWidget = new SimplePanel();
	private final static ClientFactory clientFactory = GWT.create(ClientFactory.class);
	
	
	public final static ClientFactory getClientFactory(){
		return clientFactory;
	}
	
	
	public void onModuleLoad() {
		
		final EventBus eventBus = clientFactory.getEventBus();
		PlaceController placeController = clientFactory.getPlaceController();
		// Start ActivityManager for the main widget with our ActivityMapper
		ActivityMapper activityMapper = new AppActivityMapper(clientFactory);
		ActivityManager activityManager = new ActivityManager(activityMapper, eventBus);
		activityManager.setDisplay(appWidget);
		
		
		// Start PlaceHistoryHandler with our PlaceHistoryMapper
		AppPlaceHistoryMapper historyMapper= GWT.create(AppPlaceHistoryMapper.class);
		final PlaceHistoryHandler historyHandler = new PlaceHistoryHandler(historyMapper);
		historyHandler.register(placeController, eventBus, defaultPlace);
		
		//
		// Register external events
		//
		ExternalEventsFactory.init(eventBus);
		
		
		//Add initial tasks like load configuration or restore state
		CreateMenuTask createMenuTask = new CreateMenuTask();
		InitialConfigTask initTask = new InitialConfigTask();
		
		TasksLoader.addTask(initTask);
		TasksLoader.addTask(createMenuTask);
		
		//run loaded tasks and show app view.
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
//				historyHandler.handleCurrentHistory();
//				eventBus.fireEvent(new ApplicationReadyEvent());
			}
		});
		
		AppResources.INSTANCE.appCss().ensureInjected();
	}
	
	public static boolean isDebug(){
		return true;
	}
	
	
	/**
	 * @todo: report an issue. snap in /var/www/a/war/
	 */
	private final native void fixChromeLayoutIssue() /*-{
		$doc.body.style.display = 'none';
		$wnd.setTimeout(function(){
			$doc.body.style.removeProperty('display');
		},25);
	}-*/;
}
