package org.rest.client.task;

import org.rest.client.ClientFactory;
import org.rest.client.RestClient;
import org.rest.client.load.LoadTask;
import org.rest.client.load.TasksCallback;
import org.rest.client.place.RequestPlace;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;

import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.RootPanel;

public class CreateMenuTask implements LoadTask {

	@Override
	public void run(TasksCallback callback, boolean lastRun) {
		final ClientFactory clientFactory = RestClient.getClientFactory();
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
//		projects.setPlace("projects");
		mv.addMenuItem(projects);
		
		MenuItemView history = clientFactory.createMenuItem(p);
		history.setText("History");
//		history.setPlace("history");
		mv.addMenuItem(history);
		
		MenuItemView settings = clientFactory.createMenuItem(p);
		settings.setText("Settings");
//		settings.setPlace("settings");
		mv.addMenuItem(settings);
		
		MenuItemView about = clientFactory.createMenuItem(p);
		about.setText("About");
//		about.setPlace("about");
		mv.addMenuItem(about);
		
		RootPanel.get("appNavigation").add(mv.asWidget());
		
		
		
		callback.onInnerTaskFinished(1);
		callback.onSuccess();
	}

	@Override
	public int getTasksCount() {
		return 1;
	}

}
