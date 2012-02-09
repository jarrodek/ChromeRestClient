package com.restclient.client.widgets;

import java.util.List;

import com.allen_sauer.gwt.log.client.Log;
import com.google.code.gwt.database.client.service.DataServiceException;
import com.google.code.gwt.database.client.service.ListCallback;
import com.google.code.gwt.database.client.service.VoidCallback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyUpEvent;
import com.google.gwt.event.dom.client.KeyUpHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.Timer;
import com.google.gwt.user.client.Window;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.RestApp;
import com.restclient.client.event.FormStateSaveEvent;
import com.restclient.client.storage.RestFormJS;

public class SaveStateDialog {
	interface Binder extends UiBinder<DialogBox, SaveStateDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox stateName;
	@UiField Button save;
	@UiField Label errorLabel;
	@UiField HTMLPanel dataValuesPanel;
	@UiField HTMLPanel overwriteInfoPanel;
	
	private final EventBus eventBus;
	
	private Timer errorTimer = new Timer() {
		@Override
		public void run() {
			errorLabel.setVisible(false);
			errorLabel.getElement().setInnerText("");
		}
	};

	public SaveStateDialog(EventBus eventBus) {
		this.eventBus = eventBus;
		Binder.BINDER.createAndBindUi(this);
		
		stateName.addKeyUpHandler( new KeyUpHandler() {
			@Override
			public void onKeyUp(KeyUpEvent event) {
				int keyCode = event.getNativeKeyCode();
				if(keyCode == KeyCodes.KEY_ENTER){
					event.preventDefault();
					onSave(null);
				} else if( keyCode == KeyCodes.KEY_ESCAPE ){
					event.preventDefault();
					onDismiss(null);
				} else {
					checkButtonState();
				}
			}
		});
		
		Scheduler.get().scheduleDeferred( new Scheduler.ScheduledCommand() {
			@Override
			public void execute() {
				stateName.getElement().focus();
			}
		});
	}

	protected void checkButtonState() {
		if( stateName.getText().trim().length() == 0 ){
			save.setEnabled(false);
		} else {
			save.setEnabled(true);
		}
	}

	public void show() {
		dialog.center();
	}
	
	public boolean isShowing(){
		return dialog.isShowing();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}

	@UiHandler("save")
	void onSave(ClickEvent event) {
		final String currentValue = stateName.getValue();
		if( currentValue.equals("") ){
			errorLabel.getElement().setInnerText("Form name is empty");
			errorLabel.setVisible(true);
			errorTimer.schedule(4000);
			stateName.getElement().focus();
			if(RestApp.isDebug()){
				Log.warn("Form name is empty.");
			}
			return;
		}
		
		if(RestApp.isDebug()){
			Log.debug("Checking if name: "+currentValue+" exists in database.");
		}
		
		//
		// First check if name is available. If not suggest replace it
		//
		RestApp.FORM_SERVICE.getByName(currentValue, new ListCallback<RestFormJS>() {
			
			@Override
			public void onFailure(DataServiceException error) {
				if(RestApp.isDebug()){
					Log.warn("Failure to fetch database data. Save as new.", error);
				}
				fireEventEndExit(currentValue);
			}
			
			@Override
			public void onSuccess(List<RestFormJS> result) {
				if(result == null || result.size() == 0){
					if(RestApp.isDebug()){
						Log.debug("No record found. Save as new");
					}
					fireEventEndExit(currentValue);
					return;
				}
				if(RestApp.isDebug()){
					Log.debug("Found previous saved data. Show overwrite options.");
				}
				dataValuesPanel.setVisible(false);
				overwriteInfoPanel.setVisible(true);
			}
		});
	}
	
	private void fireEventEndExit(String formName){
		if(RestApp.isDebug()){
			Log.debug("Fire event to save form with name: " + formName);
		}
		eventBus.fireEventFromSource(new FormStateSaveEvent(formName), SaveStateDialog.class);
		dialog.hide();
	}
	
	@UiHandler("overwrite")
	void onOverwrite(ClickEvent e){
		if(RestApp.isDebug()){
			Log.debug("Overwrite new form data. First remove old one.");
		}
		final String currentValue = stateName.getValue();
		RestApp.FORM_SERVICE.deleteByName(currentValue, new VoidCallback() {
			@Override
			public void onFailure(DataServiceException error) {
				if(RestApp.isDebug()){
					Log.error("Unble to remove previous form :/ Try again. ", error);
				}
				Window.alert("Unable to complete. Check console output for more info.");
			}
			@Override
			public void onSuccess() {
				if(RestApp.isDebug()){
					Log.debug("Old form values has been removed.");
				}
				fireEventEndExit(currentValue);
			}
		});
	}
	@UiHandler("saveAsNew")
	void onSaveAsNew(ClickEvent e){
		if(RestApp.isDebug()){
			Log.debug("Saving as new...");
		}
		final String currentValue = stateName.getValue();
		fireEventEndExit(currentValue);
	}
	@UiHandler("back")
	void onBack(ClickEvent e){
		dataValuesPanel.setVisible(true);
		overwriteInfoPanel.setVisible(false);
	}
}
