package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.Scheduler;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.TextBox;
import com.restclient.client.event.EncodingAddEvent;

public class AddEncodingDialog {
	interface Binder extends UiBinder<DialogBox, AddEncodingDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField TextBox encoding;
	
	private final EventBus eventBus;

	public AddEncodingDialog(EventBus eventBus) {
		this.eventBus = eventBus;
		Binder.BINDER.createAndBindUi(this);
		Scheduler.get().scheduleDeferred( new Scheduler.ScheduledCommand() {
			@Override
			public void execute() {
				encoding.getElement().focus();
			}
		});
		dialog.addDomHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				int keyCode = event.getNativeKeyCode();
				if(keyCode == KeyCodes.KEY_ENTER){
					onSave(null);
				} else if( keyCode == KeyCodes.KEY_ESCAPE ){
					onDismiss(null);
				}
			}
		}, KeyDownEvent.getType());
	}

	public void show() {
		dialog.center();
	}

	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		EncodingAddEvent ev = new EncodingAddEvent( null );
		eventBus.fireEvent(ev);
		dialog.hide();
	}
	
	@UiHandler("save")
	void onSave(ClickEvent event) {
		String currentValue = encoding.getValue();
		if( currentValue.equals("") ){
			return;
		}
		EncodingAddEvent ev = new EncodingAddEvent( currentValue );
		eventBus.fireEvent(ev);
		dialog.hide();
	}
}
