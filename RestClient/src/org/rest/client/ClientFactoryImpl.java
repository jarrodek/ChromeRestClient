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

import org.rest.client.storage.store.FormEncodingStoreWebSql;
import org.rest.client.storage.store.HeadersStoreWebSql;
import org.rest.client.storage.store.HistoryRequestStoreWebSql;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectStoreWebSql;
import org.rest.client.storage.store.RequestDataStoreWebSql;
import org.rest.client.storage.store.StatusesStoreWebSql;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.storage.store.WebSocketDataStoreWebSql;
import org.rest.client.storage.websql.ExportedDataReferenceService;
import org.rest.client.ui.AboutView;
import org.rest.client.ui.AddEncodingView;
import org.rest.client.ui.ErrorDialogView;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;
import org.rest.client.ui.ImportExportView;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuItemView.Presenter;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.SaveRequestDialogView;
import org.rest.client.ui.SavedView;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.ShortcutView;
import org.rest.client.ui.SocketView;
import org.rest.client.ui.desktop.AboutViewImpl;
import org.rest.client.ui.desktop.AddEncodingViewImpl;
import org.rest.client.ui.desktop.ErrorDialogViewImpl;
import org.rest.client.ui.desktop.HistoryListItemViewImpl;
import org.rest.client.ui.desktop.HistoryViewImpl;
import org.rest.client.ui.desktop.ImportExportViewImpl;
import org.rest.client.ui.desktop.MenuItemViewImpl;
import org.rest.client.ui.desktop.MenuViewImpl;
import org.rest.client.ui.desktop.RequestViewImpl;
import org.rest.client.ui.desktop.ResponseViewImpl;
import org.rest.client.ui.desktop.SaveRequestDialogViewImpl;
import org.rest.client.ui.desktop.SavedViewImpl;
import org.rest.client.ui.desktop.SettingsViewImpl;
import org.rest.client.ui.desktop.ShortcutViewImpl;
import org.rest.client.ui.desktop.SocketViewImpl;

import com.google.gwt.chrome.message.BackgroundMessage;
import com.google.gwt.chrome.message.ChromeMessagePassing;
import com.google.gwt.core.client.GWT;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.websocket.client.WebSocket;
import com.google.gwt.websocket.client.WebSocketImpl;
import com.google.web.bindery.event.shared.EventBus;
import com.google.web.bindery.event.shared.SimpleEventBus;

public class ClientFactoryImpl implements ClientFactory {

	private static final EventBus eventBus = new SimpleEventBus();
	private static final PlaceController placeController = new PlaceController(
			eventBus);
	private static RequestView requestView = null;
	// private static ResponseView responseView = null;
	// private static AboutView aboutView = null;
	private static MenuView menu = null;
	// private static SettingsView settingsView = null;
	private static LocalStore latestRequestStore = null;
	private static RequestDataStoreWebSql requestDataStore = null;
	private static HistoryRequestStoreWebSql historyRequestStore = null;
	private static FormEncodingStoreWebSql formEncodingStore = null;
	private static UrlHistoryStoreWebSql urlHistoryStore = null;
	private static HeadersStoreWebSql headersStore = null;
	private static StatusesStoreWebSql statusesStore = null;
	private static ProjectStoreWebSql projectsStore = null;
	private static WebSocketDataStoreWebSql webSocketSqlStore = null;
	private static ExportedDataReferenceService exportedDataService = null;
	/**
	 * It must be cached and created only once!
	 */
	private static ChromeMessagePassing chromeMessagePassing = null;

	@Override
	public EventBus getEventBus() {
		return eventBus;
	}

	@Override
	public PlaceController getPlaceController() {
		return placeController;
	}

	@Override
	public RequestView getRequestView() {
		if (requestView == null) {
			requestView = GWT.create(RequestViewImpl.class);
		}
		return requestView;
	}

	@Override
	public ResponseView getResponseView() {
		// if(responseView == null){
		// responseView = GWT.create(ResponseView.class);
		// }
		// return responseView;
		return GWT.create(ResponseViewImpl.class);
	}

	@Override
	public MenuView getMenuView() {
		if (menu == null) {
			menu = new MenuViewImpl();
		}
		return menu;
	}

	@Override
	public MenuItemView createMenuItem(Presenter presenter) {
		MenuItemViewImpl menu = GWT.create(MenuItemViewImpl.class);
		menu.setPresenter(presenter);
		return menu;
	}

	@Override
	public LocalStore getLocalStore() {
		if (latestRequestStore == null) {
			latestRequestStore = GWT.create(LocalStore.class);
		}
		return latestRequestStore;
	}

	@Override
	public RequestDataStoreWebSql getRequestDataStore() {
		if (requestDataStore == null) {
			requestDataStore = GWT.create(RequestDataStoreWebSql.class);
		}
		return requestDataStore;
	}

	@Override
	public HistoryRequestStoreWebSql getHistoryRequestStore() {
		if (historyRequestStore == null) {
			historyRequestStore = GWT.create(HistoryRequestStoreWebSql.class);
		}
		return historyRequestStore;
	}

	@Override
	public ProjectStoreWebSql getProjectsStore() {
		if (projectsStore == null) {
			projectsStore = GWT.create(ProjectStoreWebSql.class);
		}
		return projectsStore;
	}

	@Override
	public AddEncodingView getAddEncodingView(EventBus eventBus) {
		AddEncodingView dialog = GWT.create(AddEncodingViewImpl.class);
		dialog.setEventBus(eventBus);
		return dialog;
	}

	@Override
	public FormEncodingStoreWebSql getFormEncodingStore() {
		if (formEncodingStore == null) {
			formEncodingStore = GWT.create(FormEncodingStoreWebSql.class);
		}
		return formEncodingStore;
	}

	@Override
	public UrlHistoryStoreWebSql getUrlHistoryStore() {
		if (urlHistoryStore == null) {
			urlHistoryStore = GWT.create(UrlHistoryStoreWebSql.class);
		}
		return urlHistoryStore;
	}

	@Override
	public HeadersStoreWebSql getHeadersStore() {
		if (headersStore == null) {
			headersStore = GWT.create(HeadersStoreWebSql.class);
		}
		return headersStore;
	}

	@Override
	public StatusesStoreWebSql getStatusesStore() {
		if (statusesStore == null) {
			statusesStore = GWT.create(StatusesStoreWebSql.class);
		}
		return statusesStore;
	}

	@Override
	public AboutView getAboutView() {
		// if(aboutView == null){
		// aboutView = GWT.create(AboutViewImpl.class);
		// }
		// return aboutView;
		return GWT.create(AboutViewImpl.class);
	}

	@Override
	public SettingsView getSettingsView() {
		// if(settingsView == null){
		// settingsView = GWT.create(SettingsViewImpl.class);
		// }
		// return settingsView;
		return GWT.create(SettingsViewImpl.class);
	}

	@Override
	public ShortcutView getShortcutView() {
		return GWT.create(ShortcutViewImpl.class);
	}

	@Override
	public SaveRequestDialogView getSaveRequestDialogView() {
		return GWT.create(SaveRequestDialogViewImpl.class);
	}

	@Override
	public ErrorDialogView getErrorDialogView() {
		return GWT.create(ErrorDialogViewImpl.class);
	}

	@Override
	public HistoryView getHistoryView() {
		return GWT.create(HistoryViewImpl.class);
	}

	@Override
	public HistoryListItemView getHistoryListItemView() {
		return GWT.create(HistoryListItemViewImpl.class);
	}

	@Override
	public ChromeMessagePassing getChromeMessagePassing() {
		if (chromeMessagePassing == null) {
			// in deferred binder change this class to one that can handle
			// message passing without content script
			chromeMessagePassing = GWT.create(BackgroundMessage.class);
		}
		return chromeMessagePassing;
	}

	@Override
	public SavedView getSavedView() {
		return GWT.create(SavedViewImpl.class);
	}

	@Override
	public ImportExportView getImportExportView() {
		return GWT.create(ImportExportViewImpl.class);
	}

	@Override
	public ExportedDataReferenceService getExportedDataReferenceService() {
		if(exportedDataService == null){
			exportedDataService = GWT
					.create(ExportedDataReferenceService.class);
		}
		return exportedDataService;
	}

	@Override
	public SocketView getSocketView() {
		return GWT.create(SocketViewImpl.class);
	}

	@Override
	public WebSocket getWebSocket() {
		return GWT.create(WebSocketImpl.class);
	}

	@Override
	public WebSocketDataStoreWebSql getWebSocketsStore() {
		if(webSocketSqlStore == null){
			webSocketSqlStore = GWT.create(WebSocketDataStoreWebSql.class);
		}
		return webSocketSqlStore;
	}
}
