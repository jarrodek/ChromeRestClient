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

import org.rest.client.storage.store.FormEncodingsStore;
import org.rest.client.storage.store.HeadersStoreWebSql;
import org.rest.client.storage.store.HistoryRequestStoreWebSql;
import org.rest.client.storage.store.LocalStore;
import org.rest.client.storage.store.ProjectsStore;
import org.rest.client.storage.store.RequestDataStore;
import org.rest.client.storage.store.StatusesStoreWebSql;
import org.rest.client.storage.store.UrlHistoryStoreWebSql;
import org.rest.client.ui.AboutView;
import org.rest.client.ui.AddEncodingView;
import org.rest.client.ui.JSONHeadersView;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.RequestView;
import org.rest.client.ui.ResponseView;
import org.rest.client.ui.SaveRequestDialogView;
import org.rest.client.ui.SettingsView;
import org.rest.client.ui.ShortcutView;

import com.google.gwt.place.shared.PlaceController;
import com.google.web.bindery.event.shared.EventBus;

public interface ClientFactory {
	
	EventBus getEventBus();
	PlaceController getPlaceController();
	
	
	//STORES
	LocalStore getLocalStore();
	RequestDataStore getRequestDataStore();
	HistoryRequestStoreWebSql getHistoryRequestStore();
	FormEncodingsStore getFormEncodingsStore();
	UrlHistoryStoreWebSql getUrlHistoryStore();
	HeadersStoreWebSql getHeadersStore();
	StatusesStoreWebSql getStatusesStore();
	ProjectsStore getProjectsStore();
	
	//VIEWS
	AddEncodingView getAddEncodingView(EventBus eventBus);
	AboutView getAboutView();
	RequestView getRequestView();
	ResponseView getResponseView();
	MenuView getMenuView();
	MenuItemView createMenuItem(org.rest.client.ui.MenuItemView.Presenter presenter);
	SettingsView getSettingsView();
	JSONHeadersView getJSONHeadersView();
	ShortcutView getShortcutView();
	SaveRequestDialogView getSaveRequestDialogView();
}
