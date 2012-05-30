package org.rest.client.ui.desktop;

import org.rest.client.headerssupport.HeaderSupport;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.DialogBox;


public class W3CHeaderErrorImpl implements HeaderSupport {

	interface Binder extends UiBinder<DialogBox, W3CHeaderErrorImpl> {
		Binder BINDER = GWT.create(Binder.class);
	}
	
	@UiField DialogBox dialog;
	@UiField Button dismiss;
	
	public W3CHeaderErrorImpl() {
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

	@Override
	public void setOnResultHandler(Callback<String, String> callback) {
		
	}
}
