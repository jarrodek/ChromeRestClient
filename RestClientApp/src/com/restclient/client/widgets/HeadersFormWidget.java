package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Set;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.uibinder.client.UiHandler;
import com.google.gwt.user.client.ui.Button;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HTMLPanel;
import com.google.gwt.user.client.ui.Widget;
import com.restclient.client.RestApp;
import com.restclient.client.event.HeaderRowRemovedEvent;
import com.restclient.client.event.HeadersChangeEvent;
import com.restclient.client.storage.DatabaseSuggestOracle;

public class HeadersFormWidget extends Composite {

	interface Binder extends UiBinder<Widget, HeadersFormWidget> {
	}

	private final EventBus eventBus;

	@UiField Button addRow;
	@UiField HTMLPanel widgetPanel;
	@UiField HTMLPanel addPanel;
	
	private List<HeaderFormRow> headers = new ArrayList<HeaderFormRow>();
	
	public HeadersFormWidget( EventBus eventBus ) {
		this.eventBus = eventBus;

		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		appendRow(null, null, false);
		HeaderRowRemovedEvent.register(eventBus, new HeaderRowRemovedEvent.Handler() {			
			@Override
			public void onRemove(HeaderFormRow row, Object source) {
				headers.remove(row);
				row = null;
				HeadersChangeEvent e = new HeadersChangeEvent(getHeadersList());
				HeadersFormWidget.this.eventBus.fireEventFromSource(e, HeadersFormWidget.class);
			}
		});
	}
	
	@UiHandler("addRow")
	void handleAppend(ClickEvent e) {
		appendRow();
	}
	
	private void appendRow(){
		appendRow(null, null, true);
	}
	
	private void appendRow(String key, String value, boolean focus){
		DatabaseSuggestOracle oracle = new DatabaseSuggestOracle(RestApp.HEADERS_SERVICE,"HeadersNames");
		HeaderFormRow row = new HeaderFormRow(eventBus, oracle);
		if( key != null ){
			row.setHeaderName(key);
		}
		if( value != null ){
			row.setHeaderValue(value);
		}
		addPanel.add(row);
		headers.add(row);
		if( focus ){
			row.focusOnInput();
		}
	}
	
	/**
	 * Fill list of headers into form
	 * @param list
	 * @param fireEvents
	 */
	public void setHeadersList(LinkedHashMap<String, String> list, boolean fireEvents){
		for( HeaderFormRow r : headers ){
			r.removeFromParent();
		}
		headers = new ArrayList<HeaderFormRow>();
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
			HeadersChangeEvent e = new HeadersChangeEvent(getHeadersList());
			eventBus.fireEventFromSource(e, HeadersFormWidget.class);
		}
	}
	public List<HeaderFormRow> getHeadersRows(){
		return headers;
	}
	public LinkedHashMap<String, String> getHeadersList(){
		LinkedHashMap<String, String> result = new LinkedHashMap<String, String>();
		int size = headers.size();
		for( int i = 0; i < size; i++ ){
			HeaderFormRow item = headers.get(i);
			result.put(item.getHeaderName(), item.getHeaderValue());
		}
		return result;
	}
}
