package com.restclient.client.widgets;

import java.util.ArrayList;
import java.util.List;

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
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.RestApp;
import com.restclient.client.event.HeaderRowRemovedEvent;
import com.restclient.client.event.HeadersChangeEvent;
import com.restclient.client.storage.HeadersSuggestOracle;

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
				HeadersChangeEvent e = new HeadersChangeEvent(getHeaders());
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
		HeadersSuggestOracle oracle = new HeadersSuggestOracle(RestApp.HEADERS_SERVICE);
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
	public void setHeadersList(final List<RequestHeader> list, boolean fireEvents){
		for( HeaderFormRow r : headers ){
			r.removeFromParent();
		}
		//null check
		if( list != null ){
			headers = new ArrayList<HeaderFormRow>();
			if( list.size() > 0 ){
				for( RequestHeader head : list ){
					if(head == null) continue;
					appendRow(head.getName(), head.getValue(), false);
				}
			} else {
				appendRow(null, null, false);
			}
		} else {
			appendRow(null, null, false);
		}
		if( fireEvents ){
			HeadersChangeEvent e = new HeadersChangeEvent(getHeaders());
			eventBus.fireEventFromSource(e, HeadersFormWidget.class);
		}
	}
	
	public List<RequestHeader> getHeaders(){
		List<RequestHeader> result = new ArrayList<RequestHeader>();
		for(HeaderFormRow row : headers){
			result.add(new RequestHeader(row.getHeaderName(), row.getHeaderValue()));
		}
		return result;
	}
}
