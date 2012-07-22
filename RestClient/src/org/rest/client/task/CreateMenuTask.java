package org.rest.client.task;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.place.AboutPlace;
import org.rest.client.place.JSONHeadersPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.storage.StoreResultCallback;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.task.ui.LoaderWidget;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.desktop.StatusNotification;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceChangeEvent;
import com.google.gwt.user.client.ui.RootPanel;

public class CreateMenuTask implements LoadTask {

	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		final ClientFactory clientFactory = RestClient.getClientFactory();
		final MenuView mv = clientFactory.getMenuView();

		MenuItemView.Presenter p = new MenuItemView.Presenter() {
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
		// history.setPlace("history");
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
		
		
		clientFactory.getEventBus().addHandler(PlaceChangeEvent.TYPE,
				new PlaceChangeEvent.Handler() {
					public void onPlaceChange(PlaceChangeEvent event) {
						Place newPlace = event.getNewPlace();
						if(newPlace instanceof AboutPlace){
							about.setSelected(true);
						} else if(newPlace instanceof RequestPlace){
							request.setSelected(true);
						} else if(newPlace instanceof SettingsPlace
								|| newPlace instanceof JSONHeadersPlace){
							settings.setSelected(true);
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
		
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 1;
	}

	@Override
	public void setLoader(LoaderWidget loaderWidget) {
		// TODO Auto-generated method stub
		
	}

}
