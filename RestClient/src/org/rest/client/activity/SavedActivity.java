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

import org.rest.client.ClientFactory;
import org.rest.client.NotificationAction;
import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.gdrive.DriveApi;
import org.rest.client.gdrive.DriveAuth;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.place.RequestPlace;
import org.rest.client.place.SavedPlace;
import org.rest.client.storage.store.RequestDataStore;
import org.rest.client.ui.SavedView;

import com.google.gwt.core.client.JavaScriptObject;
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
		RequestDataStore.remove(request.getId(), "saved", new RequestDataStore.StoreSimpleCallback() {

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
				RequestDataStore.insert(request, new RequestDataStore.StoreInsertCallback() {
					@Override
					public void onSuccess(int result) {
						JsArray<RequestObject> list = JsArray.createArray().cast();
						request.setId(result); //required by SQL.
						list.set(0, request);
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
	public void changeSavedName(String newName, int savedId) {
		RequestDataStore.updateName(newName, savedId, new RequestDataStore.StoreSimpleCallback() {

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
		recentQuery = query;
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
		RequestDataStore.query(q, PAGE_SIZE, offset,
				new RequestDataStore.StoreResultsCallback() {

					@Override
					public void onSuccess(final JsArray<JavaScriptObject> result) {
						fetchingNextPage = false;
						if(result == null) {
							return;
						}
						int size = result.length();
						if (size == 0) {
							view.setNoMoreItems();
							return;
						}
						JsArray<RequestObject> list = result.cast();
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
