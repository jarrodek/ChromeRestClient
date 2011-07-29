package com.restclient.client.headersupport;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;
import com.restclient.client.HeaderSupport;


public class W3CSetHeadersError implements HeaderSupport {

	interface Binder extends UiBinder<DialogBox, W3CSetHeadersError> {
		Binder BINDER = GWT.create(Binder.class);
	}
	
	@UiField DialogBox dialog;
	@UiField Button dismiss;
	
	public W3CSetHeadersError() {
		Binder.BINDER.createAndBindUi(this);
	}

	@Override
	public void setValue(String value) {}

	@Override
	public void openDialog() {
		dialog.show();
		dialog.center();
	}

	@UiHandler("dismiss")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
}
