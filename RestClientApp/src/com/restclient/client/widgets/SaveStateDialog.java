package com.restclient.client.widgets;

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
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.event.FormStateSaveEvent;

public class SaveStateDialog {
	interface Binder extends UiBinder<DialogBox, SaveStateDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox stateName;
	@UiField Button save;
	@UiField Label errorLabel;
	
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
		String currentValue = stateName.getValue();
		if( currentValue.equals("") ){
			errorLabel.getElement().setInnerText("Form name is empty");
			errorLabel.setVisible(true);
			errorTimer.schedule(4000);
			return;
		}
		eventBus.fireEventFromSource(new FormStateSaveEvent(currentValue), SaveStateDialog.class);
		dialog.hide();
	}
}
