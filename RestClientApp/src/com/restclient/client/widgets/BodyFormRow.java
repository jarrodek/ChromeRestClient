package com.restclient.client.widgets;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TextBox;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.event.BodyFormRowChangeEvent;
import com.restclient.client.event.BodyFormRowRemovedEvent;

/**
 * Request POST/PUT entity body form row.
 * 
 * @author jarrod
 *
 */
public class BodyFormRow extends Composite {

	interface Binder extends UiBinder<Widget, BodyFormRow> {
	}

	private final EventBus eventBus;

	@UiField
	TextBox bodyName;
	@UiField
	TextBox bodyValue;
	@UiField
	Button removeBtn;

	public BodyFormRow(EventBus eventBus) {
		this.eventBus = eventBus;
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		bodyName.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				BodyFormRow.this.eventBus.fireEventFromSource(new BodyFormRowChangeEvent(BodyFormRow.this), BodyFormRow.class);
			}
		});
		bodyValue.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				BodyFormRow.this.eventBus.fireEventFromSource(new BodyFormRowChangeEvent(BodyFormRow.this), BodyFormRow.class);
			}
		});
	}
	
	public void setName(String name){
		bodyName.setValue(name);
	}
	public String getName(){
		return bodyName.getValue();
	}
	public void setValue(String value){
		bodyValue.setValue(value);
	}
	public String getValue(){
		return bodyValue.getValue();
	}
	/**
	 * Set focus to body item name field.
	 */
	public void focusOnInput(){
		bodyName.getElement().focus();
	}

	@UiHandler("removeBtn")
	void onClick(ClickEvent e) {
		removeRow();
	}

	private void removeRow() {
		this.removeFromParent();
		BodyFormRow.this.eventBus.fireEventFromSource(new BodyFormRowRemovedEvent(BodyFormRow.this), BodyFormRow.class);
	}

}
