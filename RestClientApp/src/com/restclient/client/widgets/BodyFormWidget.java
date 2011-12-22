package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.event.BodyChangeEvent;
import com.restclient.client.event.BodyFormRowRemovedEvent;
import com.restclient.client.request.RequestDataFormatter;

public class BodyFormWidget extends Composite {
	
	/**
	 * Class representing single row from body form.
	 * @author Paweł Psztyć
	 *
	 */
	public static class BodyFormValue {
		private String name;
		private String value;
		
		public BodyFormValue(String name, String value){
			this.name = name;
			this.value = value;
		}
		/**
		 * @return BODY parameter name
		 */
		public String getName() {
			return name;
		}
		/**
		 * @param name BODY parameter name
		 */
		public void setName(String name) {
			this.name = name;
		}
		/**
		 * @return BODY field value
		 */
		public String getValue() {
			return value;
		}
		/**
		 * @param BODY field value
		 */
		public void setValue(String value) {
			this.value = value;
		}
	}
	
	interface Binder extends UiBinder<Widget, BodyFormWidget> {
	}

	private final EventBus eventBus;

	@UiField Button addRow;
	@UiField HTMLPanel widgetPanel;
	@UiField HTMLPanel addPanel;
	
	private List<BodyFormRow> body = new ArrayList<BodyFormRow>();
	
	public BodyFormWidget( EventBus eventBus ) {
		this.eventBus = eventBus;

		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		addRow.addClickHandler(new ClickHandler() {
			@Override
			public void onClick(ClickEvent event) {
				appendRow();
			}
		});
		appendRow(null, null, false);
		
		BodyFormRowRemovedEvent.register(eventBus, new BodyFormRowRemovedEvent.Handler() {
			@Override
			public void onRemove(BodyFormRow row, Object source) {
				body.remove(row);
				row = null;
				BodyChangeEvent e = new BodyChangeEvent( RequestDataFormatter.parseData( getBodyList() ));
				BodyFormWidget.this.eventBus.fireEventFromSource(e, BodyFormWidget.class);
			}
		});
		
		
	}
	
	private void appendRow(){
		appendRow(null, null, true);
	}
	
	private void appendRow(String key, String value, boolean focus){
		BodyFormRow row = new BodyFormRow(eventBus);
		if( key != null ){
			row.setName(key);
		}
		if( value != null ){
			row.setValue(value);
		}
		addPanel.add(row);
		body.add(row);
		if( focus ){
			row.focusOnInput();
		}
	}

	public void setBodyList(List<BodyFormValue> list, boolean fireEvents) {
		for( BodyFormRow row : body ){
			row.removeFromParent();
		}
		body = new ArrayList<BodyFormRow>();
		if(list != null && list.size() > 0 ){
			for(BodyFormValue item : list){
				if(item == null) continue;
				appendRow(item.getName(), item.getValue(), false);
			}
		} else {
			appendRow(null, null, false);
		}
		if( fireEvents ){
			BodyChangeEvent e = new BodyChangeEvent( RequestDataFormatter.parseData( list ));
			eventBus.fireEventFromSource(e, BodyFormWidget.class);
		}
	}
	public List<BodyFormValue> getBodyList(){
		List<BodyFormValue> result = new ArrayList<BodyFormWidget.BodyFormValue>();
		int size = body.size();
		for( int i = 0; i < size; i++ ){
			BodyFormRow item = body.get(i);
			result.add( new BodyFormValue(item.getName(), item.getValue()));
		}
		return result;
	}
}
