package org.rest.client.task.ui;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;

public class LoaderWidget extends Composite implements HasText {

	interface Binder extends UiBinder<Widget, LoaderWidget> {
	}

	@UiField Label loadingInfo;
	@UiField DivElement progress;
	@UiField DivElement pacman;
	
	public LoaderWidget() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
	}

	/**
	 * Sets loader text
	 */
	public void setText(String loadingText) {
		loadingInfo.setText(loadingText);
	}
	/**
	 * Get displayed loader text
	 */
	public String getText() {
		return loadingInfo.getText();
	}
	
	public void setProgress(int percent){
		progress.setAttribute("style", "width: "+percent+"%");
		String calcValue = ""+percent+"% - 1px";
		pacman.setAttribute("style", "left:-webkit-calc("+calcValue+");left:-moz-calc("+calcValue+");left:-o-calc("+calcValue+");left:calc("+calcValue+");");
	}

	public void setFatalError(String message) {
		//TODO: create error screen
		loadingInfo.setText(message);
	}
}
