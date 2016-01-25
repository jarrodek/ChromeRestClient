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
package org.rest.client.activity;

import java.util.ArrayList;

import org.rest.client.ClientFactory;
import org.rest.client.NotificationAction;
import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.gdrive.DriveApi;
import org.rest.client.gdrive.DriveAuth;
import org.rest.client.jso.RequestObject;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.storage.store.RequestDataStoreWebSql;
import org.rest.client.ui.SavedView;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.user.client.ui.AcceptsOneWidget;

/**
 * Activities typically restore state ("wake up"), perform initialization (
 * "set up"), and load a corresponding UI ("show up")
 * 
 * @author Paweł Psztyć
 * 
 */
public class SavedActivity extends ListActivity implements SavedView.Presenter {

	private SavedView view;

	public SavedActivity(SavedPlace place, ClientFactory clientFactory) {
		super(clientFactory);
	}

	@Override
	public void start(AcceptsOneWidget panel, com.google.gwt.event.shared.EventBus eventBus) {
		super.start(panel, eventBus);

		view = clientFactory.getSavedView();
		view.setPresenter(this);
		panel.setWidget(view.asWidget());

		performQuery();
	}

	@Override
	public void removeFromSaved(final RequestObject request) {
		clientFactory.getRequestDataStore().remove(request.getId(), new RequestDataStoreWebSql.StoreSimpleCallback() {

			@Override
			public void onSuccess() {
				notifyRemoveAndRestore(request);
			}

			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Unable remove saved request.", e);
				}
				StatusNotification.notify("Unable remove saved request :(", StatusNotification.TIME_SHORT);
			}
		});
	}

	private void notifyRemoveAndRestore(final RequestObject request) {

		NotificationAction action = new NotificationAction();
		action.name = "Undo";
		action.callback = new StatusNotification.NotificationCallback() {
			@Override
			public void onActionPerformed() {
				final RequestObject save = RequestObject.copyNew(request);
				clientFactory.getRequestDataStore().insert(save, new RequestDataStoreWebSql.StoreInsertCallback() {
					@Override
					public void onSuccess(int result) {
						save.setId(result);
						ArrayList<RequestObject> list = new ArrayList<RequestObject>();
						list.add(save);
						view.appendResults(list);
					}
					@Override
					public void onError(Throwable e) {
						if (RestClient.isDebug()) {
							Log.error("Unable to restore the request.", e);
						}
						StatusNotification.notify("Unable to restore the request :(", StatusNotification.TIME_SHORT);
					}
				});
			}
		};
		StatusNotification.notify("The Request has been deleted.", 30000, action);
	}

	@Override
	public void onClearSaved() {
		clientFactory.getRequestDataStore().removeNonProject(new RequestDataStoreWebSql.StoreSimpleCallback() {
			@Override
			public void onError(Throwable e) {

			}

			@Override
			public void onSuccess() {

			}
		});
	}

	@Override
	public void changeSavedName(String newName, int savedId) {
		clientFactory.getRequestDataStore().updateName(newName, savedId, new RequestDataStoreWebSql.StoreSimpleCallback() {

			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Unable to change name :(", e);
				}
				StatusNotification.notify("Unable to change name :(", StatusNotification.TIME_SHORT);
			}

			@Override
			public void onSuccess() {

			}
		});
	}

	@Override
	public void getNextItemsPage() {
		current_page++;
		performQuery();
	}

	@Override
	public void serach(String query) {
		recentQuery = "%" + query + "%";
		current_page = 0;
		view.clearResultList();
		performQuery();
	}

	@Override
	void performQuery() {
		if (fetchingNextPage) {
			return;
		}
		fetchingNextPage = true;

		final String q = (recentQuery != null && recentQuery.length() > 2) ? recentQuery : null;
		int offset = current_page * PAGE_SIZE;
		clientFactory.getRequestDataStore().query(q, PAGE_SIZE, offset,
				new RequestDataStoreWebSql.StoreResultsCallback() {

					@Override
					public void onSuccess(final JsArray<RequestObject> result) {
						fetchingNextPage = false;
						int size = result.length();
						if (size == 0) {
							view.setNoMoreItems();
							return;
						}
						ArrayList<RequestObject> list = new ArrayList<RequestObject>();
						for (int i = 0; i < size; i++) {
							list.add(result.get(i));
						}
						view.appendResults(list);
					}

					@Override
					public void onError(Throwable e) {
						fetchingNextPage = false;
						if (RestClient.isDebug()) {
							Log.error("Database error. Unable read history data.", e);
						}
						StatusNotification.notify("Database error. Unable read history data.",
								StatusNotification.TIME_SHORT);
					}
				});
	}

	@Override
	public void openFromGoogleDrive() {
		DriveApi.hasSession(new DriveApi.SessionHandler() {
			@Override
			public void onResult(DriveAuth result) {
				if (result == null) {
					// no logged in user
					DriveApi.auth(new DriveApi.SessionHandler() {
						@Override
						public void onResult(DriveAuth result) {
							if (result == null) {
								view.setDriveButtonEnabled(true);
								return;
							}
							pickDriveArcFile(result.getAccessToken());
						}
					}, false);
					return;
				}
				pickDriveArcFile(result.getAccessToken());
			}
		});
	}

	private void pickDriveArcFile(final String accessToken) {
		DriveApi.showSavedFilesPicker(accessToken, new DriveApi.SelectFolderHandler() {
			@Override
			public void onSelect(String fileId) {
				goTo(RequestPlace.Tokenizer.fromDriveFile(fileId));
			}

			@Override
			public void onCancel() {
				view.setDriveButtonEnabled(true);
			}
		});
	}
}
