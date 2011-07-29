package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
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

	@UiField
	DialogBox dialog;
	@UiField TextBox encoding;
	
	private final EventBus eventBus;

	public AddEncodingDialog(EventBus eventBus) {
		this.eventBus = eventBus;
		Binder.BINDER.createAndBindUi(this);
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
		EncodingAddEvent ev = new EncodingAddEvent( encoding.getValue() );
		eventBus.fireEvent(ev);
		dialog.hide();
	}
}
