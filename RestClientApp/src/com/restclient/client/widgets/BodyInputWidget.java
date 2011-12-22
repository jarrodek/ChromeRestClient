package com.restclient.client.widgets;

import java.util.List;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.logical.shared.SelectionEvent;
import com.google.gwt.event.logical.shared.SelectionHandler;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.EventBus;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.TabLayoutPanel;
import com.google.gwt.user.client.ui.Widget;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.TextArea;
import com.restclient.client.event.BodyChangeEvent;
import com.restclient.client.event.BodyFormRowChangeEvent;
import com.restclient.client.event.BodyFormRowRemovedEvent;
import com.restclient.client.event.BodyTabOpenEvent;
import com.restclient.client.request.RequestDataFormatter;
import com.restclient.client.request.RequestParameters;
import com.restclient.client.request.ViewParameters;
import com.restclient.client.widgets.BodyFormWidget.BodyFormValue;

public class BodyInputWidget extends Composite {

	interface Binder extends UiBinder<Widget, BodyInputWidget> {
	}

	private final EventBus eventBus;

	@UiField
	TextArea rawInput;
	@UiField(provided=true)
	BodyFormWidget form;
	@UiField(provided = true)
	FileInputWidget file;
	@UiField
	TabLayoutPanel tabPanel;
	
	public BodyInputWidget(EventBus eventBus) {
		this.eventBus = eventBus;
		
		form = new BodyFormWidget(eventBus);
		file = new FileInputWidget(eventBus);
		
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
		
		BodyTabOpenEvent.register(eventBus, new BodyTabOpenEvent.Handler() {
			@Override
			public void onOpen(int tabPosition, Object source) {
				//
				// Change from local storage saved state
				//
				if( source != null && source.equals(ViewParameters.class) ){
					tabPanel.selectTab(tabPosition);
				}
			}
		});
		
		tabPanel.addSelectionHandler(new SelectionHandler<Integer>() {
			@Override
			public void onSelection(SelectionEvent<Integer> event) {
				BodyInputWidget.this.eventBus.fireEvent(new BodyTabOpenEvent(event.getSelectedItem()));
			}
		});
		rawInput.addValueChangeHandler(new ValueChangeHandler<String>() {
			@Override
			public void onValueChange(ValueChangeEvent<String> event) {
				String currentValue = event.getValue();
				List<BodyFormValue> data = RequestDataFormatter.parseBodyData( currentValue );
				form.setBodyList(data, false);
				BodyInputWidget.this.eventBus.fireEventFromSource(new BodyChangeEvent( currentValue ), BodyInputWidget.this);
			}
		});
		BodyFormRowChangeEvent.register(eventBus, new BodyFormRowChangeEvent.Handler() {
			@Override
			public void onChange(BodyFormRow row, Object source) {
				List<BodyFormValue> list = form.getBodyList();
				String data = RequestDataFormatter.parseData(list);
				rawInput.setValue(data);
				BodyChangeEvent e = new BodyChangeEvent(data);
				BodyInputWidget.this.eventBus.fireEventFromSource(e, BodyInputWidget.class);
			}
		});
		BodyFormRowRemovedEvent.register(eventBus, new BodyFormRowRemovedEvent.Handler() {
			@Override
			public void onRemove(BodyFormRow row, Object source) {
				List<BodyFormValue> list = form.getBodyList();
				String data = RequestDataFormatter.parseData(list);
				rawInput.setValue(data);
			}
		});
		BodyChangeEvent.register(eventBus, new BodyChangeEvent.Handler() {
			@Override
			public void onChange(String body, Object source) {
				if( source != null && source.equals(RequestParameters.class) ){
					rawInput.setValue( body );
					List<BodyFormValue> list = RequestDataFormatter.parseBodyData(body);
					form.setBodyList(list, false);
				}
			}
		});
	}

}
