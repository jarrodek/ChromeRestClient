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
import org.rest.client.load.LoadTask;
import org.rest.client.load.TasksCallback;
import org.rest.client.load.TasksLoader;
import org.rest.client.mvp.AppActivityMapper;
import org.rest.client.mvp.AppPlaceHistoryMapper;
import org.rest.client.place.RequestPlace;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;

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
				RootPanel.get("appContainer").add(appWidget);
				historyHandler.handleCurrentHistory();
				
				eventBus.fireEvent(new ApplicationReadyEvent());
			}
		});
		
		AppResources.INSTANCE.appCss().ensureInjected();
	}
	
	LoadTask createMenuTask = new LoadTask() {
		
		@Override
		public void run(TasksCallback callback, boolean lastRun) {
			MenuView mv = clientFactory.getMenuView();
			
			org.rest.client.ui.MenuItemView.Presenter p = new org.rest.client.ui.MenuItemView.Presenter() {
				@Override
				public void goTo(Place place) {
					clientFactory.getPlaceController().goTo(place);
				}
			};
			
			MenuItemView request = clientFactory.createMenuItem(p);
			request.setText("Request");
			request.setPlace(new RequestPlace(null));
			request.setSelected(true);
			mv.addMenuItem(request);
			
			MenuItemView projects = clientFactory.createMenuItem(p);
			projects.setText("Projects");
//			projects.setPlace("projects");
			mv.addMenuItem(projects);
			
			MenuItemView history = clientFactory.createMenuItem(p);
			history.setText("History");
//			history.setPlace("history");
			mv.addMenuItem(history);
			
			MenuItemView settings = clientFactory.createMenuItem(p);
			settings.setText("Settings");
//			settings.setPlace("settings");
			mv.addMenuItem(settings);
			
			MenuItemView about = clientFactory.createMenuItem(p);
			about.setText("About");
//			about.setPlace("about");
			mv.addMenuItem(about);
			
			RootPanel.get("appNavigation").add(mv.asWidget());
			
			
			
			callback.onInnerTaskFinished();
			callback.onSuccess();
		}
		
		@Override
		public int getTasksCount() {
			return 1;
		}
	};
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
