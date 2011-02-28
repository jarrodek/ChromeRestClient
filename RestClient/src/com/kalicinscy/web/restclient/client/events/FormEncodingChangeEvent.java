package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.GwtEvent;


public class FormEncodingChangeEvent extends GwtEvent<FormEncodingChangeHandler> {
	
	public static Type<FormEncodingChangeHandler> TYPE = new Type<FormEncodingChangeHandler>();
	
	private final String data;
	
	public FormEncodingChangeEvent(String data){
		this.data = data;
	}
	
	
	@Override
	public Type<FormEncodingChangeHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(FormEncodingChangeHandler handler) {
		handler.onEncodingChange(this);
	}
	
	public String getData() {
        return this.data;
    }
}
