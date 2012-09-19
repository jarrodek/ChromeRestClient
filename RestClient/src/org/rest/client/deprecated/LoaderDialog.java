package org.rest.client.deprecated;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.Style.Visibility;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.KeyCodes;
import com.google.gwt.event.dom.client.KeyDownEvent;
import com.google.gwt.event.dom.client.KeyDownHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.DialogBox;
import com.google.gwt.user.client.ui.Label;

public class LoaderDialog {

	public static interface DismissHandler {
		void onDismiss();
	}

	interface Binder extends UiBinder<DialogBox, LoaderDialog> {
		Binder BINDER = GWT.create(Binder.class);
	}

	@UiField DialogBox dialog;
	@UiField Label loaderText;
	@UiField DivElement dismissBar;

	private DismissHandler dissmissHandler;
	private boolean canDismiss = false;

	public LoaderDialog(String message, boolean canDismiss) {
		this.canDismiss = canDismiss;
		Binder.BINDER.createAndBindUi(this);
		setDismissCntrols();
		loaderText.setText(message);
		dialog.addDomHandler(new KeyDownHandler() {
			@Override
			public void onKeyDown(KeyDownEvent event) {
				int keyCode = event.getNativeKeyCode();
				if (keyCode == KeyCodes.KEY_ESCAPE) {
					onDismiss(null);
				}
			}
		}, KeyDownEvent.getType());
	}

	public void show() {
		dialog.center();
	}
	
	public void hide() {
		dialog.hide();
	}

	/**
	 * If true user can dismiss dialog either by pressing "dismiss" button or by
	 * press ESC key.
	 * 
	 * @param canDismiss
	 */
	public void setCanDismiss(boolean canDismiss) {
		this.canDismiss = canDismiss;
		setDismissCntrols();
	}
	/**
	 * Set handler for user dismiss action
	 * @param dissmissHandler
	 */
	public void setDismissHandler(DismissHandler dissmissHandler){
		this.dissmissHandler = dissmissHandler;
	}
	/**
	 * Set dialog message 
	 * @param message
	 */
	public void setMessage(String message){
		loaderText.setText(message);
	}
	
	private void setDismissCntrols(){
		if(!canDismiss){
			dismissBar.getStyle().setVisibility(Visibility.HIDDEN);
		} else {
			dismissBar.getStyle().setVisibility(Visibility.VISIBLE);
		}
	}
	
	@UiHandler("cancel")
	void onDismiss(ClickEvent event) {
		if (!canDismiss)
			return;
		dialog.hide();
		if(dissmissHandler != null){
			dissmissHandler.onDismiss();
		}
	}

}
