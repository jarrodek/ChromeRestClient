package com.kalicinscy.web.restclient.client.ui;

import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.logical.shared.HasValueChangeHandlers;
import com.google.gwt.event.logical.shared.ValueChangeEvent;
import com.google.gwt.event.logical.shared.ValueChangeHandler;
import com.google.gwt.event.shared.GwtEvent;
import com.google.gwt.event.shared.HandlerManager;
import com.google.gwt.event.shared.HandlerRegistration;
import com.google.gwt.event.shared.HasHandlers;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.HorizontalPanel;
import com.google.gwt.user.client.ui.RadioButton;
import com.google.gwt.user.client.ui.Widget;
import com.kalicinscy.web.restclient.client.RestClient;

public class MethodsRow extends Composite implements ClickHandler, HasHandlers, HasValueChangeHandlers<String> {

	private String method = "GET";

	public MethodsRow() {
		panel = new HorizontalPanel();
		method = RestClient.REST_PARAMS.getMethod();
		
		RadioButton rdbtnGet = new RadioButton("methodSelect", "GET");
		rdbtnGet.setValue(true);
		panel.add(rdbtnGet);
		
		RadioButton rdbtnPost = new RadioButton("methodSelect", "POST");
		panel.add(rdbtnPost);
		if( method.equals("POST") ){
			rdbtnPost.setValue(true);
		}

		RadioButton rdbtnPut = new RadioButton("methodSelect", "PUT");
		panel.add(rdbtnPut);
		if( method.equals("PUT") ){
			rdbtnPut.setValue(true);
		}

		RadioButton rdbtnDelete = new RadioButton("methodSelect", "DELETE");
		panel.add(rdbtnDelete);
		if( method.equals("DELETE") ){
			rdbtnDelete.setValue(true);
		}

		RadioButton rdbtnHead = new RadioButton("methodSelect", "HEAD");
		panel.add(rdbtnHead);
		if( method.equals("HEAD") ){
			rdbtnHead.setValue(true);
		}

		RadioButton rdbtnOptions = new RadioButton("methodSelect", "OPTIONS");
		panel.add(rdbtnOptions);
		if( method.equals("OPTIONS") ){
			rdbtnOptions.setValue(true);
		}
		rdbtnGet.addClickHandler(this);
		rdbtnPost.addClickHandler(this);
		rdbtnPut.addClickHandler(this);
		rdbtnDelete.addClickHandler(this);
		rdbtnHead.addClickHandler(this);
		rdbtnOptions.addClickHandler(this);
		
		initWidget(panel);
	}

	@Override
	public void onClick(ClickEvent event) {
		RadioButton button = (RadioButton) event.getSource();
		if (button.getValue()) {
			method = button.getHTML();
			notyfiValueChanged();
		}
	}
	
	private HandlerManager handlerManager = new HandlerManager(this);
	private HorizontalPanel panel;
	
	@Override
	public HandlerRegistration addValueChangeHandler(
			ValueChangeHandler<String> handler) {
		return handlerManager.addHandler( ValueChangeEvent.getType(), handler );
	}
	
	@Override
	public void fireEvent(GwtEvent<?> event) {
		handlerManager.fireEvent(event);
	}
	
	private void notyfiValueChanged(){
		ValueChangeEvent.fire(this, method);
	}

	public void updateMethod(String _method, boolean notyfi){
		int cnt = panel.getWidgetCount();
		for( int i=0; i<cnt; i++ ){
			Widget w = panel.getWidget(i);
			if( w instanceof RadioButton ){
				RadioButton r = (RadioButton)w;
				if(r.getHTML().equals(_method)){
					r.setValue(true);
					method = _method;
					if( notyfi ){
						notyfiValueChanged();
					}
					break;
				}
			}
		}
	}
}
