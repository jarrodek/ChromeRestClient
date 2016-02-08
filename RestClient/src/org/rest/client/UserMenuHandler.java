package org.rest.client;

import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.event.NewProjectAvailableEvent;
import org.rest.client.event.ProjectChangeEvent;
import org.rest.client.event.ProjectDeleteEvent;
import org.rest.client.jso.ProjectObject;
import org.rest.client.place.AboutPlace;
import org.rest.client.place.HistoryPlace;
import org.rest.client.place.ImportExportPlace;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.place.SettingsPlace;
import org.rest.client.place.SocketPlace;

import com.google.gwt.place.shared.Place;
import com.google.gwt.place.shared.PlaceChangeEvent;

public class UserMenuHandler {

	private ClientFactory clientFactory;
	private boolean created = false;

	public UserMenuHandler(ClientFactory clientFactory) {
		if (created)
			return;
		this.clientFactory = clientFactory;
		bind();
	}
	/**
	 * Handle project name change by invoking change method in the arc-menu element
	 * @param project Changed project data
	 */
	private final native void handleProjectChange(ProjectObject project) /*-{
		var menu = $doc.querySelector('arc-menu');
		if(!menu) {
			console.error('arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalytics::sendException(Ljava/lang/String;)('UserMenuHandler::handleProjectChange::arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalyticsApp::sendException(Ljava/lang/String;)('UserMenuHandler::handleProjectChange::arc-menu element not found in the DOM.');
			return;
		}
		menu.updateProjectName(project.id, project.name);
	}-*/;
	/**
	 * Handle adding new project action.
	 * @param projectId New project id
	 */
	private final native void handleAddProject(int projectId) /*-{
		var menu = $doc.querySelector('arc-menu');
		if(!menu) {
			console.error('arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalytics::sendException(Ljava/lang/String;)('UserMenuHandler::handleAddProject::arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalyticsApp::sendException(Ljava/lang/String;)('UserMenuHandler::handleAddProject::arc-menu element not found in the DOM.');
			return;
		}
		menu.appendProject(projectId);
	}-*/;
	
	private final native void handleRemoveProject(int projectId) /*-{
		var menu = $doc.querySelector('arc-menu');
		if(!menu) {
			console.error('arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalytics::sendException(Ljava/lang/String;)('UserMenuHandler::handleRemoveProject::arc-menu element not found in the DOM.');
			@org.rest.client.analytics.GoogleAnalyticsApp::sendException(Ljava/lang/String;)('UserMenuHandler::handleRemoveProject::arc-menu element not found in the DOM.');
			return;
		}
		menu.removeProject(projectId);
	}-*/;

	private void bind() {
		ProjectChangeEvent.register(clientFactory.getEventBus(), new ProjectChangeEvent.Handler() {
			@Override
			public void onProjectChange(ProjectObject project) {
				handleProjectChange(project);
			}
		});
		// observe add project event to add new item to menu
		NewProjectAvailableEvent.register(clientFactory.getEventBus(), new NewProjectAvailableEvent.Handler() {
			@Override
			public void onNewProject(int projectId) {
				handleAddProject(projectId);
			}
		});
		ProjectDeleteEvent.register(clientFactory.getEventBus(), new ProjectDeleteEvent.Handler() {
			@Override
			public void onProjectDelete(int projectId) {
				handleRemoveProject(projectId);
			}
		});

		clientFactory.getEventBus().addHandler(PlaceChangeEvent.TYPE, new PlaceChangeEvent.Handler() {
			public void onPlaceChange(PlaceChangeEvent event) {

				Place newPlace = event.getNewPlace();
				String gaName = null;

				if (newPlace instanceof AboutPlace) {
					gaName = "#AboutPlace:" + ((AboutPlace) newPlace).getToken();
				} else if (newPlace instanceof RequestPlace) {
					RequestPlace _place = (RequestPlace) newPlace;
					if (_place.isProject() || _place.isProjectsEndpoint()) {
						//projects.setSelected(true);
					} else {
						//request.setSelected(true);
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
					gaName = "#SettingsPlace:" + ((SettingsPlace) newPlace).getToken();
				} else if (newPlace instanceof ImportExportPlace) {
					gaName = "#ImportExportPlace:" + ((ImportExportPlace) newPlace).getToken();
				} else if (newPlace instanceof HistoryPlace) {
					gaName = "#HistoryPlace:" + ((HistoryPlace) newPlace).getToken();
				} else if (newPlace instanceof SavedPlace) {
					gaName = "#SavedPlace:" + ((SavedPlace) newPlace).getToken();
				} else if (newPlace instanceof SocketPlace) {
					gaName = "#SocketPlace:" + ((SocketPlace) newPlace).getToken();
				}
				GoogleAnalytics.sendPageView(gaName);
				GoogleAnalyticsApp.sendScreen(gaName);
			}
		});
	}
}
