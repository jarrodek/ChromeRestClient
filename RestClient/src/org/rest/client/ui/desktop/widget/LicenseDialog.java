package org.rest.client.ui.desktop.widget;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.DialogBox;

public class LicenseDialog implements KeyDownHandler {
	
	interface Binder extends UiBinder<DialogBox, LicenseDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}
	@UiField DialogBox dialog;
	
	public LicenseDialog(){
		Binder.BINDER.createAndBindUi(this);
		dialog.addDomHandler(this, KeyDownEvent.getType());
	}
	
	
	@Override
	public void onKeyDown(KeyDownEvent event) {
		int keyCode = event.getNativeKeyCode();
		if (keyCode == KeyCodes.KEY_ESCAPE) {
			dialog.hide();
		}
	}
	
	public void show() {
		dialog.show();
		dialog.center();
	}
	
	@UiHandler("closeButton")
	void onDismiss(ClickEvent event) {
		dialog.hide();
	}
}
