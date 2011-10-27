package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.RadioButton;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.event.MethodChangeEvent;

/**
 * Request method selector
 * @author jarrod
 *
 */
public class MethodsWidget extends Composite implements ValueChangeHandler<Boolean> {

	interface Binder extends UiBinder<Widget, MethodsWidget> {
	}
	private final EventBus eventBus;
	
	@UiField RadioButton radioGet;
	@UiField RadioButton radioPost;
	@UiField RadioButton radioPut;
	@UiField RadioButton radioDelete;
	@UiField RadioButton radioHead;
	@UiField RadioButton radioOptions;
	@UiField RadioButton radioPatch;
	@UiField RadioButton radioOther;
	@UiField TextBox otherMethodValue;
	
	private String currentSelected = "GET";
	
	/**
	 * @param eventBus
	 */
	public MethodsWidget(final EventBus eventBus) {
		this.eventBus = eventBus;
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		radioGet.addValueChangeHandler(this);
		radioPost.addValueChangeHandler(this);
		radioPut.addValueChangeHandler(this);
		radioDelete.addValueChangeHandler(this);
		radioHead.addValueChangeHandler(this);
		radioOptions.addValueChangeHandler(this);
		radioPatch.addValueChangeHandler(this);
		radioOther.addValueChangeHandler(this);
		
		otherMethodValue.addValueChangeHandler( new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String old = currentSelected;
				currentSelected = event.getValue();
				MethodChangeEvent ev = new MethodChangeEvent(old, currentSelected);
				eventBus.fireEvent(ev);
			}
		});
		
	}

	@Override
	public void onValueChange(ValueChangeEvent<Boolean> event) {
		if( !event.getValue().booleanValue() ){
			return;
		}
		
		RadioButton obj = (RadioButton) event.getSource();
		String old = currentSelected;
		String newValue = obj.getText();
		if( newValue.equals("Other") ){
			otherMethodValue.setEnabled(true);
			currentSelected = otherMethodValue.getValue();
		} else {
			otherMethodValue.setEnabled(false);
			currentSelected = newValue;
		}
		
		MethodChangeEvent ev = new MethodChangeEvent(old, currentSelected);
		eventBus.fireEvent(ev);
	}


	/**
	 * @return
	 */
	public String getValue() {
		return currentSelected;
	}

	
	/**
	 * @param value
	 */
	public void setValue(String value) {
		setValue(value, false);
	}


	/**
	 * @param value
	 * @param fireEvents
	 */
	public void setValue(String value, boolean fireEvents) {
		this.currentSelected = value;
		if( value.equals("GET") ){
			radioGet.setValue(true, fireEvents);
		} else if ( value.equals("POST") ){
			radioPost.setValue(true, fireEvents);
		} else if ( value.equals("PUT") ){
			radioPut.setValue(true, fireEvents);
		} else if ( value.equals("DELETE") ){
			radioDelete.setValue(true, fireEvents);
		} else if ( value.equals("HEAD") ){
			radioHead.setValue(true, fireEvents);
		} else if ( value.equals("OPTIONS") ){
			radioOptions.setValue(true, fireEvents);
		} else if ( value.equals("PATCH") ){
			radioPatch.setValue(true, fireEvents);
		} else {
			otherMethodValue.setEnabled(true);
			otherMethodValue.setValue( value );
			radioOther.setValue(true, fireEvents);
		}
	}
	
}
