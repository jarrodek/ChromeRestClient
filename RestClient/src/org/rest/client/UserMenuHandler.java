package org.rest.client;

import java.util.Collection;
import java.util.Map;

import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.objects.ProjectObject;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.desktop.StatusNotification;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceChangeEvent;
import com.google.gwt.user.client.ui.RootPanel;

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
		// projects.setPlace();
		mv.addMenuItem(projects);

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
		
		
		ProjectStoreWebSql projectsStore = clientFactory.getProjectsStore();
		projectsStore.all(new StoreResultCallback<Map<Integer,ProjectObject>>() {
			@Override
			public void onSuccess(Map<Integer, ProjectObject> result) {
				Collection<ProjectObject> values = result.values();
				for(ProjectObject obj : values){
					MenuItemView _project = clientFactory.createMenuItem(p);
					_project.setText(obj.getName());
					_project.setPlace(RequestPlace.Tokenizer.fromProjectDefault(obj.getId()));
					projects.addChild(_project);
				}
			}
			
			@Override
			public void onError(Throwable e) {
				
			}
		});
		
		
		clientFactory.getEventBus().addHandler(PlaceChangeEvent.TYPE,
				new PlaceChangeEvent.Handler() {
					public void onPlaceChange(PlaceChangeEvent event) {
						Place newPlace = event.getNewPlace();
						if(newPlace instanceof AboutPlace){
							about.setSelected(true);
						} else if(newPlace instanceof RequestPlace){
							request.setSelected(true);
						} else if(newPlace instanceof SettingsPlace){
							settings.setSelected(true);
						} else if(newPlace instanceof HistoryPlace){
							history.setSelected(true);
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
