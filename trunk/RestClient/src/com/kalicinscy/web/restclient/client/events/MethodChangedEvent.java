package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.GwtEvent;


public class MethodChangedEvent extends GwtEvent<MethodChangedHandler> {
	
	public static Type<MethodChangedHandler> TYPE = new Type<MethodChangedHandler>();
	
	private final String data;
	
	public MethodChangedEvent(String data){
		this.data = data;
	}
	
	
	@Override
	public Type<MethodChangedHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(MethodChangedHandler handler) {
		handler.onMethodChange(this);
	}
	
	public String getData() {
        return this.data;
    }
}
