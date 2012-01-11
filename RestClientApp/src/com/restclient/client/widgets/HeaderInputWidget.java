package com.restclient.client.widgets;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TabLayoutPanel;
import com.google.gwt.user.client.ui.TextArea;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.xhr2.client.RequestHeader;
import com.restclient.client.event.HeaderChangeEvent;
import com.restclient.client.event.HeaderRowRemovedEvent;
import com.restclient.client.event.HeadersChangeEvent;
import com.restclient.client.event.HeadersTabOpenEvent;
import com.restclient.client.request.RequestDataFormatter;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;
/**
 * Widget with HEADERS inputs.
 * @author jarrod
 *
 */
public class HeaderInputWidget extends Composite {

	interface Binder extends UiBinder<Widget, HeaderInputWidget> {
	}

	private final EventBus eventBus;

	@UiField TextArea rawInput;
	@UiField(provided=true) HeadersFormWidget form;
	@UiField TabLayoutPanel tabPanel;
	/**
	 * Constructor.
	 * @param eventBus
	 */
	public HeaderInputWidget(EventBus eventBus) {
		this.eventBus = eventBus;
		
		form = new HeadersFormWidget(eventBus);
		
		initWidget(GWT.<Binder> create(Binder.class).createAndBindUi(this));
		
		for (int i = 0; i < tabPanel.getWidgetCount(); i++) {
	        final Widget widget = tabPanel.getWidget(i);
	        DOM.setStyleAttribute(widget.getElement(), "position", "relative");

	        Element parent = DOM.getParent(widget.getElement());
	        Element parent2 = DOM.getParent(parent);
	        Element parent3 = DOM.getParent(parent2);
	        DOM.setStyleAttribute(parent2, "position", "relative");
	        DOM.setStyleAttribute(parent3, "position", "relative");
	        DOM.setStyleAttribute(parent, "position", "relative");
	        DOM.setStyleAttribute(parent, "overflowX", "visible");
	        DOM.setStyleAttribute(parent, "overflowY", "visible");
	    }
		
		tabPanel.selectTab(0);
		
		HeadersTabOpenEvent.register(eventBus, new HeadersTabOpenEvent.Handler() {
			@Override
			public void onOpen(int tabPosition, Object source) {
				//
				// Change from localstorage saved state
				//
				if( source != null && source.equals(ViewParameters.class) ){
					tabPanel.selectTab(tabPosition);
				}
			}
		});
		tabPanel.addSelectionHandler(new SelectionHandler<Integer>() {
			@Override
			public void onSelection(SelectionEvent<Integer> event) {
				HeaderInputWidget.this.eventBus.fireEvent( new HeadersTabOpenEvent(event.getSelectedItem()) );
			}
		});
		rawInput.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				List<RequestHeader> data = RequestDataFormatter.parseHeaders( event.getValue() );
				form.setHeadersList(data, false);
				HeadersChangeEvent e = new HeadersChangeEvent(data);
				HeaderInputWidget.this.eventBus.fireEventFromSource(e, HeaderInputWidget.class);
			}
		});
		HeaderChangeEvent.register(eventBus, new HeaderChangeEvent.Handler() {
			@Override
			public void onChange(HeaderFormRow row, Object source) {
				List<RequestHeader> list = form.getHeaders();
				rawInput.setValue( RequestDataFormatter.headersToString(list) );
				HeadersChangeEvent e = new HeadersChangeEvent(list);
				HeaderInputWidget.this.eventBus.fireEventFromSource(e, HeaderInputWidget.class);
			}
		});
		HeaderRowRemovedEvent.register(eventBus, new HeaderRowRemovedEvent.Handler() {			
			@Override
			public void onRemove(HeaderFormRow row, Object source) {
				List<RequestHeader> list = form.getHeaders();
				rawInput.setValue( RequestDataFormatter.headersToString(list) );
			}
		});
		HeadersChangeEvent.register(eventBus, new HeadersChangeEvent.Handler() {
			@Override
			public void onChange(List<RequestHeader> headers, Object source) {
				if( source != null && source.equals(RequestParameters.class) ){
					
					for(RequestHeader fromList : headers){
						if(fromList.getName().toLowerCase().equals("content-type")){
							headers.remove(fromList);
							break;
						}
					}
					
					rawInput.setValue( RequestDataFormatter.headersToString(headers) );
					form.setHeadersList(headers, false);
				}
			}
		});
	}

}
