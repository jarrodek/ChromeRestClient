package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;

public class GETParamFormRow extends Composite {

	interface Binder extends UiBinder<Widget, GETParamFormRow> {
	}

	@UiField TextBox paramName;
	@UiField TextBox paramValue;
	@UiField Button removeBtn;
	private boolean encoded = false;
	
	public GETParamFormRow() {
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		paramName.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				encoded = false;
			}
		});
		paramValue.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				encoded = false;
			}
		});
	}
	
	public void setParamName(String name){
		paramName.setValue(name);
	}
	public String getParamName(){
		return paramName.getValue();
	}
	public void setParamValue(String name){
		paramValue.setValue(name);
	}
	public String getParamValue(){
		return paramValue.getValue();
	}
	/**
	 * 
	 * @return true if value of this string has been encoded
	 */
	public boolean isEncoded(){
		return this.encoded;
	}
	/**
	 * 
	 * @param encoded true if value of this param has been encoded
	 */
	public void setEncoded(boolean encoded){
		this.encoded = encoded;
	}

	@UiHandler("removeBtn")
	void onClick(ClickEvent e) {
		removeRow();
	}

	private void removeRow() {
		this.removeFromParent();
	}

	public void focusOnInput() {
		paramName.getElement().focus();
	}

}
