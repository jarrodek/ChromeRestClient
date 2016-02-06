package org.rest.client.ui.desktop;

import org.rest.client.RestClient;
import org.rest.client.StatusNotification;
import org.rest.client.analytics.GoogleAnalytics;
import org.rest.client.analytics.GoogleAnalyticsApp;
import org.rest.client.gdrive.DriveFileItem;
import org.rest.client.gdrive.GoogleDrive;
import org.rest.client.jso.ProjectObject;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.place.RequestPlace;
import org.rest.client.storage.store.ProjectsStore;
import org.rest.client.storage.store.RequestDataStore;
import org.rest.client.ui.SaveRequestDialogView;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.event.dom.client.ChangeEvent;
import com.google.gwt.event.dom.client.ChangeHandler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.History;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.CheckBox;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.ListBox;
import com.google.gwt.user.client.ui.PopupPanel;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class SaveRequestDialogViewImpl implements CloseHandler<PopupPanel>, KeyDownHandler, SaveRequestDialogView {

	interface Binder extends UiBinder<DialogBox, SaveRequestDialogViewImpl> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField
	DialogBox dialog;
	@UiField
	TextBox name;
	@UiField
	TextBox projectName;
	@UiField
	CheckBox addToProject;
	@UiField
	ListBox projectList;
	@UiField
	DivElement projectNameContainer;
	@UiField
	Button save;
	@UiField
	Button overwrite;
	@UiField
	Button gdrive;
	
	int overwriteId = -1;
	boolean forceOverwrite = false;

	public SaveRequestDialogViewImpl() {
		Binder.BINDER.createAndBindUi(this);

		addToProject.addValueChangeHandler(new ValueChangeHandler<Boolean>() {
			@Override
			public void onValueChange(ValueChangeEvent<Boolean> event) {
				if (event.getValue()) {
					projectList.setEnabled(true);
					gdrive.setEnabled(false);
				} else {
					projectList.setEnabled(false);
					gdrive.setEnabled(true);
				}
				projectListValueChange();
			}
		});

		projectList.addChangeHandler(new ChangeHandler() {
			@Override
			public void onChange(ChangeEvent event) {
				projectListValueChange();
			}
		});
	}

	/**
	 * The flow is different depending on different reqiests initial state. For
	 * new request the app just allow the user tosave the request but restored
	 * request the user can override it or store as new.
	 */
	private void handleRestoredRequests() {
		//
		// check if it is a restored request. The user may want to overwrite
		// existing request.
		//
		if (RestClient.RESTORED_REQUEST != null) {
			if (RestClient.RESTORED_REQUEST > 0) {
				overwriteId = RestClient.RESTORED_REQUEST;
				RequestDataStore.getByKey(RestClient.RESTORED_REQUEST,
						new RequestDataStore.StoreResultCallback() {
							@Override
							public void onSuccess(JavaScriptObject result) {
								if (result == null) {
									overwriteId = -1;
									return;
								}
								RequestObject item = result.cast();
								name.setValue(item.getName());
								overwrite.setVisible(true);
								save.setText("Save as new");
							}

							@Override
							public void onError(Throwable e) {
								overwriteId = -1;
								Log.error("Unable read stored data :(", e);
							}
						});
			}
		}
		if (RestClient.CURRENT_GOOGLE_DRIVE_ITEM != null && !RestClient.CURRENT_GOOGLE_DRIVE_ITEM.isEmpty()) {
			RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {
				@Override
				public void onSuccess(RequestObject result) {
					// Log.debug("NAME: " + result.getName());
					name.setValue(result.getName());
					overwrite.setVisible(true);
					overwrite.addStyleName("driveButton");
					gdrive.setVisible(false);
					// save.setVisible(false);
					// name.setEnabled(false);
					// addToProject.setEnabled(false);
				}

				@Override
				public void onFailure(Throwable reason) {
					if (RestClient.isDebug()) {
						Log.error("Unable collect request data", reason);
					}
				}
			});
		} else if (RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID != null
				&& !RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID.isEmpty()) {
			overwrite.setVisible(false);
			save.setVisible(false);
			addToProject.setEnabled(false);
		}
	}

	private void setProjectsList() {
		ProjectsStore.all(new ProjectsStore.StoreResultsCallback() {
			@Override
			public void onSuccess(final JsArray<ProjectObject> result) {
				for (int i = 0; i < result.length(); i++) {
					ProjectObject project = result.get(i);
					if (project == null) {
						continue;
					}
					String name = project.getName();
					if (name == null || name.isEmpty()) {
						continue;
					}
					int id = project.getId();
					projectList.addItem(name, String.valueOf(id));
				}
			}

			@Override
			public void onError(Throwable e) {
				if (RestClient.isDebug()) {
					Log.error("Unable to read stored projects. Error during read operation.", e);
				}
				StatusNotification.notify("Unable to set projects data..", StatusNotification.TIME_MEDIUM);
			}
		});
	}

	/**
	 * Get current or last used URL.
	 * 
	 * @param callback
	 */
	private void getPreviewURL(final Callback<String, Throwable> callback) {
		if (History.getToken().startsWith("RequestPlace")) {
			RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {

				@Override
				public void onSuccess(RequestObject result) {
					callback.onSuccess(result.getURL());
				}

				@Override
				public void onFailure(Throwable reason) {
					Log.error("setPreviewURL::Errror::1::" + reason.getMessage());
					callback.onFailure(reason);
				}
			});
		} else {
			RequestObject.restoreLatest(new Callback<RequestObject, Throwable>() {
				@Override
				public void onSuccess(RequestObject result) {
					callback.onSuccess(result.getURL());
				}

				@Override
				public void onFailure(Throwable reason) {
					Log.error("setPreviewURL::Errror::2::" + reason.getMessage());
					callback.onFailure(reason);
				}
			});
		}
	}

	

	private void projectListValueChange() {
		if (!addToProject.getValue()) {
			projectNameContainer.addClassName("hidden");
			return;
		}

		String _projectName = projectList.getValue(projectList.getSelectedIndex());
		if (_projectName.equals("")) {
			projectNameContainer.addClassName("hidden");
			return;
		}

		if (_projectName.equals("__new__")) {
			projectNameContainer.removeClassName("hidden");
		} else {
			int parojectId = -1;
			projectNameContainer.addClassName("hidden");
			try {
				parojectId = Integer.parseInt(_projectName);
			} catch (Exception e) {
			}
			if (parojectId == -1) {
				StatusNotification.notify("This is not a valid project!", StatusNotification.TIME_SHORT);
			}
		}

		dialog.center();
	}

	@Override
	public void show() {
		getPreviewURL(new Callback<String, Throwable>() {

			@Override
			public void onSuccess(String result) {
				
				if (result == null || result.isEmpty()) {
					StatusNotification.notify("Enter an URL of the request.", StatusNotification.TIME_MEDIUM);
					dialog.hide();
					dialog.removeFromParent();
					RestClient.isSaveDialogEnabled = false;
					return;
				}
				RestClient.isSaveDialogEnabled = true;
				dialog.addDomHandler(SaveRequestDialogViewImpl.this, KeyDownEvent.getType());
				dialog.addCloseHandler(SaveRequestDialogViewImpl.this);
				name.getElement().setAttribute("placeholder", "name...");
				projectName.getElement().setAttribute("placeholder", "project name...");
				setProjectsList();
				handleRestoredRequests();
				dialog.show();
				dialog.center();
			}

			@Override
			public void onFailure(Throwable reason) {
				StatusNotification.notify("An error occurred. It was reported.", StatusNotification.TIME_MEDIUM);
				GoogleAnalytics.sendException("SaveRequestDialogViewImpl::Request restore::" + reason.getMessage());
				GoogleAnalyticsApp.sendException("SaveRequestDialogViewImpl::Request restore::" + reason.getMessage());
				Log.error("Unable restore proper URL.", reason);
			}
		});
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}

	@UiHandler("save")
	void onSave(ClickEvent event) {
		save.setEnabled(false);
		forceOverwrite = false;
		doSaveRequest(true);
	}

	@UiHandler("overwrite")
	void onOverwrite(ClickEvent event) {
		save.setEnabled(false);
		overwrite.setEnabled(false);
		forceOverwrite = true;

		if (RestClient.CURRENT_GOOGLE_DRIVE_ITEM != null && !RestClient.CURRENT_GOOGLE_DRIVE_ITEM.isEmpty()) {
			doSaveGdrive();
			return;
		}

		doSaveRequest(false);
	}

	@Override
	public void onClose(CloseEvent<PopupPanel> event) {
		RestClient.isSaveDialogEnabled = false;
	}

	@Override
	public void onKeyDown(KeyDownEvent event) {

		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ENTER) {
			onSave(null);
		} else if (keyCode == KeyCodes.KEY_ESCAPE) {
			onDismiss(null);
		}
	}

	@Override
	public Widget asWidget() {
		return dialog.asWidget();
	}

	@UiHandler("gdrive")
	void onGdriveSave(ClickEvent e) {
		e.preventDefault();

		if (name.getValue().isEmpty()) {
			StatusNotification.notify("Name can't be empty.", StatusNotification.TIME_SHORT);
			save.setEnabled(true);
			return;
		}

		gdrive.setEnabled(false);
		save.setEnabled(false);

		doSaveGdrive();
		GoogleAnalytics.sendEvent("Engagement", "Click", "Save request to Drive");
		GoogleAnalyticsApp.sendEvent("Engagement", "Click", "Save request to Drive");
	}

	/**
	 * TODO: views shouldn't perform logic actions.
	 */
	void doSaveGdrive() {
		this.dialog.setVisible(false);
		RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {

			@Override
			public void onSuccess(final RequestObject result) {
				if (!forceOverwrite) {
					result.setName(name.getValue());
				} else {
					result.setGDriveId(RestClient.CURRENT_GOOGLE_DRIVE_ITEM);
				}
				if (RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID != null) {
					RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID = null;
				}

				GoogleDrive.saveRequestFile(result, RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID,
						new Callback<DriveFileItem, Throwable>() {

					@Override
					public void onSuccess(DriveFileItem result) {
						save.setEnabled(true);
						gdrive.setEnabled(true);

						if (result == null) {
							// only if cancel
							return;
						}

						dialog.hide();
						StatusNotification.notify("File saved", StatusNotification.TIME_SHORT);
						RestClient.CURRENT_GOOGLE_DRIVE_ITEM = null;
						RestClient.GOOGLE_DRIVE_CREATE_FOLDER_ID = null;

						RestClient.getClientFactory().getPlaceController()
								.goTo(RequestPlace.Tokenizer.fromDriveFile(result.getId()));
					}

					@Override
					public void onFailure(Throwable reason) {
						save.setEnabled(true);
						gdrive.setEnabled(true);
						if (RestClient.isDebug()) {
							Log.error("Unable to save request data.", reason);
						}
						StatusNotification.notify(reason.getMessage(), StatusNotification.TIME_MEDIUM);
					}
				});

			}

			@Override
			public void onFailure(Throwable reason) {
				save.setEnabled(true);
				gdrive.setEnabled(true);
				if (RestClient.isDebug()) {
					Log.error("Unable to save request data. Can't collect current request data.", reason);
				}
				StatusNotification.notify("Unable to save request data!", StatusNotification.TIME_MEDIUM);
			}
		});
	}

	private void doSaveRequest(final boolean isSave) {
		if (name.getValue().isEmpty()) {
			StatusNotification.notify("Name can't be empty.", StatusNotification.TIME_SHORT);
			save.setEnabled(true);
			return;
		}
		GoogleAnalytics.sendEvent("Engagement", "Click", "Save request");
		GoogleAnalyticsApp.sendEvent("Engagement", "Click", "Save request");

		RestClient.collectRequestData(new Callback<RequestObject, Throwable>() {

			@Override
			public void onSuccess(final RequestObject result) {
				result.setName(name.getValue());
				if (forceOverwrite && overwriteId > 0) {
					result.setId(overwriteId);
				}
				//
				// check project data
				//
				String _projectName = projectList.getValue(projectList.getSelectedIndex());
				if (_projectName.equals("__new__")) {
					String newProjectName = projectName.getValue();
					if (isSave) {
						result.resetId();
					}
					// add new project
					RestClient.saveRequestDataWithProject(result, newProjectName, new Callback<RequestObject, Throwable>() {
						@Override
						public void onSuccess(RequestObject result) {
							save.setEnabled(true);

							RestClient.getClientFactory().getPlaceController()
									.goTo(RequestPlace.Tokenizer.fromProject(result.getId()));
							dialog.hide();
						}

						@Override
						public void onFailure(Throwable reason) {
							save.setEnabled(true);
							StatusNotification.notify("Unable to save request data!", StatusNotification.TIME_MEDIUM);
						}
					});
					return;
				} else if (!_projectName.equals("")) {
					int projectId = -1;
					projectNameContainer.addClassName("hidden");
					try {
						projectId = Integer.parseInt(_projectName);
					} catch (Exception e) {
					}

					if (projectId == -1) {
						save.setEnabled(true);
						StatusNotification.notify("This is not a valid project!", StatusNotification.TIME_SHORT);
						if (RestClient.isDebug()) {
							Log.error("Unable to save request data. Selected project has no numeric value.");
						}
						return;
					}
					result.setProject(projectId);
				}
				if (isSave) {
					result.resetId();
				}
				RestClient.saveRequestData(result, null, new Callback<RequestObject, Throwable>() {
					@Override
					public void onSuccess(RequestObject result) {
						save.setEnabled(true);
						dialog.hide();
						// if(RestClient.CURRENT_GOOGLE_DRIVE_ITEM != null &&
						// !RestClient.CURRENT_GOOGLE_DRIVE_ITEM.isEmpty()){
						RestClient.getClientFactory().getPlaceController()
								.goTo(RequestPlace.Tokenizer.fromSaved(result.getId()));
						// }
					}

					@Override
					public void onFailure(Throwable reason) {
						save.setEnabled(true);
						StatusNotification.notify("Unable to save request data!", StatusNotification.TIME_MEDIUM);
					}
				});
			}

			@Override
			public void onFailure(Throwable reason) {
				save.setEnabled(true);
				if (RestClient.isDebug()) {
					Log.error("Unable to save request data. Can't collect current request data.", reason);
				}
				StatusNotification.notify("Unable to save request data!", StatusNotification.TIME_MEDIUM);
			}
		});
	}
}
