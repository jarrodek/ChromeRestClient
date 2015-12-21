package org.rest.client;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.event.NewProjectAvailableEvent;
import org.rest.client.event.ProjectChangeEvent;
import org.rest.client.event.ProjectDeleteEvent;
import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.place.SocketPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.StoreKeys;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea;
import com.google.gwt.chrome.storage.StorageArea.StorageItemsCallback;
import com.google.gwt.chrome.storage.StorageResult;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceChangeEvent;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

public class UserMenuHandler {

	private ClientFactory clientFactory;
	private boolean created = false;

	public UserMenuHandler(ClientFactory clientFactory) {
		if (created)
			return;
		this.clientFactory = clientFactory;
		bind();
	}

	protected void bind() {

		final MenuView mv = clientFactory.getMenuView();

		final MenuItemView.Presenter p = new MenuItemView.Presenter() {
			@Override
			public void goTo(Place place) {
				clientFactory.getPlaceController().goTo(place);
			}
		};

		final MenuItemView request = clientFactory.createMenuItem(p);
		request.setText("Request");
		request.setPlace(new RequestPlace("default"));
		request.setSelected(true);
		request.setData("place", "request");
		mv.addMenuItem(request);

		final MenuItemView socket = clientFactory.createMenuItem(p);
		socket.setText("Socket");
		socket.setPlace(new SocketPlace("default"));
		socket.setData("place", "socket");
		mv.addMenuItem(socket);

		final MenuItemView projects = clientFactory.createMenuItem(p);
		projects.setText("Projects");
		mv.addMenuItem(projects);
		projects.setData("place", "projects");
		projects.setOpened(false);

		final MenuItemView saved = clientFactory.createMenuItem(p);
		saved.setText("Saved");
		saved.setPlace(new SavedPlace("default"));
		saved.setData("place", "saved");
		mv.addMenuItem(saved);

		final MenuItemView history = clientFactory.createMenuItem(p);
		history.setText("History");
		history.setPlace(new HistoryPlace("default"));
		history.setData("place", "history");
		mv.addMenuItem(history);

		final MenuItemView settings = clientFactory.createMenuItem(p);
		settings.setText("Settings");
		settings.setPlace(new SettingsPlace("view"));
		settings.setData("place", "settings");
		mv.addMenuItem(settings);

		final MenuItemView about = clientFactory.createMenuItem(p);
		about.setText("About");
		about.setPlace(new AboutPlace("view"));
		about.setData("place", "about");
		mv.addMenuItem(about);

		RootPanel.get("appNavigation").add(mv.asWidget());

		final ArrayList<MenuItemView> projectsMenu = new ArrayList<MenuItemView>();
		final ProjectStoreWebSql projectsStore = clientFactory.getProjectsStore();
		projectsStore.all(new StoreResultCallback<Map<Integer, ProjectObject>>() {
			@Override
			public void onSuccess(Map<Integer, ProjectObject> result) {
				Collection<ProjectObject> values = result.values();
				for (ProjectObject obj : values) {
					MenuItemView _project = clientFactory.createMenuItem(p);
					_project.setText(obj.getName());
					_project.setData("projectid", String.valueOf(obj.getId()));
					_project.setPlace(RequestPlace.Tokenizer.fromProjectDefault(obj.getId()));
					_project.setParentItem(projects);
					projectsMenu.add(_project);
					projects.addChild((Widget) _project);
				}
				projects.setOpened(false);
			}

			@Override
			public void onError(Throwable e) {

			}
		});

		ProjectChangeEvent.register(clientFactory.getEventBus(), new ProjectChangeEvent.Handler() {
			@Override
			public void onProjectChange(ProjectObject project) {
				for (MenuItemView item : projectsMenu) {
					if (item.getData("projectid").equals(project.getId() + "")) {
						item.setText(project.getName());
						break;
					}
				}
			}
		});

		// observe add project event to add new item to menu
		NewProjectAvailableEvent.register(clientFactory.getEventBus(), new NewProjectAvailableEvent.Handler() {

			@Override
			public void onNewProject(int projectId) {
				projectsStore.getByKey(projectId, new StoreResultCallback<ProjectObject>() {

					@Override
					public void onSuccess(ProjectObject result) {
						if (result == null)
							return;
						MenuItemView _project = clientFactory.createMenuItem(p);
						_project.setText(result.getName());
						_project.setPlace(RequestPlace.Tokenizer.fromProjectDefault(result.getId()));
						_project.setData("projectid", String.valueOf(result.getId()));
						_project.setParentItem(projects);
						projectsMenu.add(_project);
						projects.addChild((Widget) _project);
					}

					@Override
					public void onError(Throwable e) {
						Log.error("Unable read project data.", e);
					}
				});
			}
		});
		ProjectDeleteEvent.register(clientFactory.getEventBus(), new ProjectDeleteEvent.Handler() {
			@Override
			public void onProjectDelete(int projectId) {
				for (MenuItemView item : projectsMenu) {
					if (item.getData("projectid").equals(projectId + "")) {
						item.remove();
						break;
					}
				}
			}
		});

		clientFactory.getEventBus().addHandler(PlaceChangeEvent.TYPE, new PlaceChangeEvent.Handler() {
			public void onPlaceChange(PlaceChangeEvent event) {

				Place newPlace = event.getNewPlace();
				String gaName = null;

				if (newPlace instanceof AboutPlace) {
					about.setSelected(true);
					gaName = "#AboutPlace:" + ((AboutPlace) newPlace).getToken();
				} else if (newPlace instanceof RequestPlace) {
					RequestPlace _place = (RequestPlace) newPlace;
					if (_place.isProject() || _place.isProjectsEndpoint()) {
						projects.setSelected(true);
					} else {
						request.setSelected(true);
					}

					if (_place.isHistory()) {
						gaName = "#RequestPlace:history";
					} else if (_place.isProjectsEndpoint()) {
						gaName = "#RequestPlace:projectEndpoint";
					} else if (_place.isProject()) {
						gaName = "#RequestPlace:project";
					} else if (_place.isSaved()) {
						gaName = "#RequestPlace:saved";
					} else if (_place.isExternal()) {
						gaName = "#RequestPlace:external";
					} else {
						gaName = "#RequestPlace:default";
					}
				} else if (newPlace instanceof SettingsPlace) {
					settings.setSelected(true);
					gaName = "#SettingsPlace:" + ((SettingsPlace) newPlace).getToken();
				} else if (newPlace instanceof ImportExportPlace) {
					settings.setSelected(true);
					gaName = "#ImportExportPlace:" + ((ImportExportPlace) newPlace).getToken();
				} else if (newPlace instanceof HistoryPlace) {
					history.setSelected(true);
					gaName = "#HistoryPlace:" + ((HistoryPlace) newPlace).getToken();
				} else if (newPlace instanceof SavedPlace) {
					saved.setSelected(true);
					gaName = "#SavedPlace:" + ((SavedPlace) newPlace).getToken();
				} else if (newPlace instanceof SocketPlace) {
					socket.setSelected(true);
					gaName = "#SocketPlace:" + ((SocketPlace) newPlace).getToken();
				}
				trackPageview(gaName);
				GoogleAnalyticsApp.sendScreen(gaName);
			}
		});

		Storage store = GWT.create(Storage.class);
		StorageArea syncStore = store.getSync();
		JSONObject jo = new JSONObject();
		jo.put(StoreKeys.HISTORY_KEY, new JSONObject(null));
		syncStore.get(jo.getJavaScriptObject(), new StorageItemsCallback() {

			@Override
			public void onError(String message) {
				StatusNotification.notify("Unable open LocalStore :(", StatusNotification.TIME_SHORT);
			}

			@Override
			public void onResult(JavaScriptObject result) {
				StorageResult<Boolean> data = result.cast();
				Boolean value = true;
				if (data == null) {
					if(RestClient.isDebug()){
						Log.warn("Unable to cast property from local storage, UserMenuHandler::bind");
					}
				} else {
					try {
						value = data.getBoolean(StoreKeys.HISTORY_KEY);
					} catch (Exception e) {
						Log.warn("Unable to cast property from local storage (HISTORY_KEY).", e);
					}
				}
				if (!value) {
					mv.hideItem(2);
				}
			}
		});
	}

	final native void trackPageview(String pageUrl) /*-{
		if (!$wnd._gaq)
			return;
		if (@org.rest.client.RestClient::isInitializing()())
			return;
		$wnd._gaq.push([ '_trackPageview', pageUrl ]);
	}-*/;

	final native void logNative(Object msg) /*-{
		console.log(msg, typeof msg);
	}-*/;
}
