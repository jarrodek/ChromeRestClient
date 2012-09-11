package org.rest.client;

import java.util.Collection;
import java.util.Map;

import org.rest.client.event.NewProjectAvailableEvent;
import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.desktop.StatusNotification;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceChangeEvent;
import com.google.gwt.user.client.ui.RootPanel;
import com.google.gwt.user.client.ui.Widget;

public class UserMenuHandler {
	
	private ClientFactory clientFactory;
	private boolean created = false;
	public UserMenuHandler(ClientFactory clientFactory){
		if(created) return;
		this.clientFactory = clientFactory;
		bind();
	}
	
	protected void bind(){
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
		mv.addMenuItem(request);

		final MenuItemView projects = clientFactory.createMenuItem(p);
		projects.setText("Projects");
		mv.addMenuItem(projects);
		projects.setOpened(false);
		
		
		final MenuItemView saved = clientFactory.createMenuItem(p);
		saved.setText("Saved");
		saved.setPlace(new SavedPlace("default"));
		mv.addMenuItem(saved);

		final MenuItemView history = clientFactory.createMenuItem(p);
		history.setText("History");
		history.setPlace(new HistoryPlace("default"));
		mv.addMenuItem(history);

		final MenuItemView settings = clientFactory.createMenuItem(p);
		settings.setText("Settings");
		settings.setPlace(new SettingsPlace("view"));
		mv.addMenuItem(settings);

		final MenuItemView about = clientFactory.createMenuItem(p);
		about.setText("About");
		about.setPlace(new AboutPlace("view"));
		mv.addMenuItem(about);

		RootPanel.get("appNavigation").add(mv.asWidget());
		
		
		final ProjectStoreWebSql projectsStore = clientFactory.getProjectsStore();
		projectsStore.all(new StoreResultCallback<Map<Integer,ProjectObject>>() {
			@Override
			public void onSuccess(Map<Integer, ProjectObject> result) {
				Collection<ProjectObject> values = result.values();
				for(ProjectObject obj : values){
					MenuItemView _project = clientFactory.createMenuItem(p);
					_project.setText(obj.getName());
					_project.setData("projectid", String.valueOf(obj.getId()));
					_project.setPlace(RequestPlace.Tokenizer.fromProjectDefault(obj.getId()));
					projects.addChild((Widget) _project);
				}
				projects.setOpened(false);
			}
			
			@Override
			public void onError(Throwable e) {
				
			}
		});
		
		//observe add project event to add new item to menu
		NewProjectAvailableEvent.register(clientFactory.getEventBus(), new NewProjectAvailableEvent.Handler() {
			
			@Override
			public void onNewProject(int projectId) {
				projectsStore.getByKey(projectId, new StoreResultCallback<ProjectObject>(){

					@Override
					public void onSuccess(ProjectObject result) {
						if(result == null) return;
						MenuItemView _project = clientFactory.createMenuItem(p);
						_project.setText(result.getName());
						_project.setPlace(RequestPlace.Tokenizer.fromProjectDefault(result.getId()));
						_project.setData("projectid", String.valueOf(result.getId()));
						projects.addChild((Widget) _project);
					}

					@Override
					public void onError(Throwable e) {
						Log.error("Unable read project data.", e);
					}
				});
			}
		});
		
		clientFactory.getEventBus().addHandler(PlaceChangeEvent.TYPE,
				new PlaceChangeEvent.Handler() {
					public void onPlaceChange(PlaceChangeEvent event) {
						Place newPlace = event.getNewPlace();
						if(newPlace instanceof AboutPlace){
							about.setSelected(true);
						} else if(newPlace instanceof RequestPlace){
							RequestPlace _place = (RequestPlace) newPlace;
							if(_place.isProject() || _place.isProjectsEndpoint()){
								projects.setSelected(true);
							} else {
								request.setSelected(true);
							}
						} else if(newPlace instanceof SettingsPlace){
							settings.setSelected(true);
						} else if(newPlace instanceof HistoryPlace){
							history.setSelected(true);
						} else if(newPlace instanceof SavedPlace){
							saved.setSelected(true);
						}
					}
			});
		
		final LocalStore localStore = clientFactory.getLocalStore();
		localStore.open(new StoreResultCallback<Boolean>() {
			@Override
			public void onSuccess(Boolean result) {
				localStore.getByKey(LocalStore.HISTORY_KEY, new StoreResultCallback<String>() {
					@Override
					public void onSuccess(String result) {
						if(result == null || result.isEmpty()){
							result = "true";
						}
						if(!result.equals("true")){
							mv.hideItem(2);
						}
					}
					@Override
					public void onError(Throwable e) {}
				});
			}
			@Override
			public void onError(Throwable e) {
				StatusNotification.notify("Unable open LocalStore :(", StatusNotification.TYPE_ERROR, StatusNotification.TIME_SHORT);
			}
		});
		
	}
}
