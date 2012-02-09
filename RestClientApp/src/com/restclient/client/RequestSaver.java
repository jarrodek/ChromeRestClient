package com.restclient.client;

import java.util.Date;
import java.util.List;
import java.util.logging.LogRecord;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.RowIdListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTML;
import com.restclient.client.event.FormStateRemoveEvent;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.widgets.SaveStateDialog;

public class RequestSaver {

	public static SaveStateDialog saveStateDialog;
	public static int currentRestoredRequestId = -1;
	public static String currentRestoredRequestName = null;
	public static boolean isRestoredRequest = false;

	/**
	 * Save current state action. Depends of state it will ask if overwrite
	 * current restored form or just open save as dialog.
	 * 
	 * If user earlier restored "request" than confirm dialog will appear with
	 * question if overwrite current form. If user click cancel or no "request"
	 * has been restored than "save as..." dialog will open.
	 */
	public static void saveCurrentAction() {
		if (isRestoredRequest) {
			StringBuilder sb = new StringBuilder();
			sb.append("Overwrite current loaded form \"");
			sb.append(currentRestoredRequestName);
			sb.append("\"?").append("\n");
			sb.append("Press \"cancel\" to show save as dialog.");

			if (Window.confirm(sb.toString())) {
				final String config = RequestParameters.getInstance()
						.toString();
				final Date current = new Date();

				RestApp.FORM_SERVICE.updateFormData(currentRestoredRequestId,
						config, current, new VoidCallback() {
							@Override
							public void onFailure(DataServiceException error) {
								if (RestApp.isDebug()) {
									Log.error(
											"SaveRequestEvent handler: Unable to update data",
											error);
								}
								StatusNotification.notify(error.getMessage(),
										StatusNotification.TYPE_ERROR);
							}

							@Override
							public void onSuccess() {
								if (RestApp.isDebug()) {
									Log.debug("SaveRequestEvent handler: updated!");
									StatusNotification.notify("Item updated.",
											StatusNotification.TYPE_NORMAL);
								}
							}
						});
				return;
			}
		}
		createSaveDialog();
	}

	/**
	 * Create and show "save as..." dialog.
	 */
	private static void createSaveDialog() {
		if (saveStateDialog != null && saveStateDialog.isShowing()) {
			return;
		}
		final String url = RequestParameters.getUrl();
		if (url.equals("")) {
			DialogBox dialog = new DialogBox();
			dialog.setAnimationEnabled(true);
			dialog.setAutoHideEnabled(true);
			dialog.setAutoHideOnHistoryEventsEnabled(true);
			dialog.setGlassEnabled(true);
			dialog.setText("First enter request URL.");
			dialog.add(new HTML(
					"You must enter request URL to save form state."));
			dialog.show();
			dialog.center();
			return;
		}
		saveStateDialog = new SaveStateDialog(
				RestClientApp.getAppMainEventBus());
		saveStateDialog.show();
	}
	
	public static void registerOnRemoveFormHandler(){
		FormStateRemoveEvent.register(RestClientApp.getAppMainEventBus(), new FormStateRemoveEvent.Handler() {
			@Override
			public void onRemove(int removedId) {
				if(isRestoredRequest){
					if(currentRestoredRequestId == removedId){
						isRestoredRequest = false;
						currentRestoredRequestId = -1;
						currentRestoredRequestName = null;
					}
				}
			}
		});
	}
	/**
	 * Perform save current state action.
	 */
	public static void saveCurrentState(final String formName){
		if(RestApp.isDebug()){
			Log.warn("FormStateSaveEvent handler: Received data to save.");
		}
		if( formName.trim().equals("") ){
			if(RestApp.isDebug()){
				Log.warn("FormStateSaveEvent handler: no name specified!");
			}
			return;
		}
		final String url = RequestParameters.getUrl();
		if(url.equals("")){
			if(RestApp.isDebug()){
				Log.warn("FormStateSaveEvent handler: current URL is empty!");
			}
			return;
		}
		final String config = RequestParameters.getInstance().toString();
		final Date current = new Date();
		
		if(RestApp.isDebug()){
			Log.debug("FormStateSaveEvent handler: Got full data. Try to save in DB.");
		}
		
		RestApp.FORM_SERVICE.insertData(formName, url, config, current, new RowIdListCallback() {
			
			@Override
			public void onFailure(DataServiceException error) {
				if(RestApp.isDebug()){
					Log.warn("FormStateSaveEvent handler: Error save data!", error);
				}
				ErrorDialog dialog = new ErrorDialog();
				dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), error.getMessage()));
			}
			
			@Override
			public void onSuccess(List<Integer> rowIds) {
				if( rowIds.size() == 0 ){
					if(RestApp.isDebug()){
						Log.error("FormStateSaveEvent handler: Insert has not return insert ID.");
					}
					ErrorDialog dialog = new ErrorDialog();
					dialog.getHandler().publish(new LogRecord(dialog.getHandler().getLevel(), "Something went wrong while saveing form state. Undefined error."));
					return;
				}
				if(RestApp.isDebug()){
					Log.debug("FormStateSaveEvent handler: saved!");
				}
			}
		});
	}
}
