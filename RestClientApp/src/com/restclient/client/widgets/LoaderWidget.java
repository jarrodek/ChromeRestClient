package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.DivElement;
import com.google.gwt.dom.client.SpanElement;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.Widget;

public class LoaderWidget extends Composite implements HasText {

	private static LoaderWidgetUiBinder uiBinder = GWT
			.create(LoaderWidgetUiBinder.class);

	interface LoaderWidgetUiBinder extends UiBinder<Widget, LoaderWidget> {
	}

	@UiField
	SpanElement loadingInfo;
	
	@UiField
	DivElement progress;
	
	public LoaderWidget() {
		initWidget(uiBinder.createAndBindUi(this));
	}

	public LoaderWidget(String loadingText) {
		initWidget(uiBinder.createAndBindUi(this));
		loadingInfo.setInnerText(loadingText);
	}
	/**
	 * Sets loader text
	 */
	public void setText(String loadingText) {
		loadingInfo.setInnerText(loadingText);
	}
	/**
	 * Get displayed loader text
	 */
	public String getText() {
		return loadingInfo.getInnerText();
	}
	
	public void setProgress(int percent){
		progress.setAttribute("style", "width: "+percent+"%");
	}
}
