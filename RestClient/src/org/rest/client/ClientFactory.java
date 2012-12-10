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
import org.rest.client.ui.EditProjectView;
import org.rest.client.ui.ErrorDialogView;
import org.rest.client.ui.HistoryListItemView;
import org.rest.client.ui.HistoryView;
import org.rest.client.ui.ImportExportView;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.SaveRequestDialogView;
import org.rest.client.ui.SavedView;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.ShortcutView;
import org.rest.client.ui.SocketView;

import com.google.gwt.chrome.message.ChromeMessagePassing;
import com.google.gwt.place.shared.PlaceController;
import com.google.gwt.websocket.client.WebSocket;
import com.google.web.bindery.event.shared.EventBus;

public interface ClientFactory {
	
	EventBus getEventBus();
	PlaceController getPlaceController();
	
	
	//STORES
	LocalStore getLocalStore();
	RequestDataStoreWebSql getRequestDataStore();
	HistoryRequestStoreWebSql getHistoryRequestStore();
	FormEncodingStoreWebSql getFormEncodingStore();
	UrlHistoryStoreWebSql getUrlHistoryStore();
	HeadersStoreWebSql getHeadersStore();
	StatusesStoreWebSql getStatusesStore();
	ProjectStoreWebSql getProjectsStore();
	WebSocketDataStoreWebSql getWebSocketsStore();
	
	//
	// Temporary stores
	//
	ExportedDataReferenceService getExportedDataReferenceService();
	
	
	//VIEWS
	AddEncodingView getAddEncodingView(EventBus eventBus);
	AboutView getAboutView();
	SavedView getSavedView();
	RequestView getRequestView();
	ResponseView getResponseView();
	MenuView getMenuView();
	MenuItemView createMenuItem(org.rest.client.ui.MenuItemView.Presenter presenter);
	SettingsView getSettingsView();
	ShortcutView getShortcutView();
	SaveRequestDialogView getSaveRequestDialogView();
	ErrorDialogView getErrorDialogView();
	HistoryView getHistoryView();
	HistoryListItemView getHistoryListItemView();
	ImportExportView getImportExportView();
	EditProjectView getEditProjectView();
	
	// Communication with extension
	ChromeMessagePassing getChromeMessagePassing();
	SocketView getSocketView();
	
	WebSocket getWebSocket();
}
