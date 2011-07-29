package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

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

public class BodyFormWidget extends Composite {

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
				BodyChangeEvent e = new BodyChangeEvent(getBodyList());
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

	public void setBodyList(LinkedHashMap<String, String> list, boolean fireEvents) {
		for( BodyFormRow row : body ){
			row.removeFromParent();
		}
		body = new ArrayList<BodyFormRow>();
		if( list.size() > 0 ){
			Set<String> set = list.keySet();
			for( String key : set ){
				String value = list.get(key);
				appendRow(key, value, false);
			}
		} else {
			appendRow(null, null, false);
		}
		if( fireEvents ){
			eventBus.fireEventFromSource(new BodyChangeEvent(list), BodyFormWidget.class);
		}
	}
	public LinkedHashMap<String, String> getBodyList(){
		LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
		int size = body.size();
		for( int i = 0; i < size; i++ ){
			BodyFormRow item = body.get(i);
			result.put(item.getName(), item.getValue());
		}
		return result;
	}
}
