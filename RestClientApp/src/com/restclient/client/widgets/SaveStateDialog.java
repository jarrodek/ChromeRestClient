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
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.event.FormStateSaveEvent;

public class SaveStateDialog {
	interface Binder extends UiBinder<DialogBox, SaveStateDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox stateName;
	@UiField Button save;
	
	private final EventBus eventBus;

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
			return;
		}
		eventBus.fireEventFromSource(new FormStateSaveEvent(currentValue), SaveStateDialog.class);
		dialog.hide();
	}
}
