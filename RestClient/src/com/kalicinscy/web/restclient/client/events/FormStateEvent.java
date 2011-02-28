package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.GwtEvent;

public class FormStateEvent extends GwtEvent<FormStateEventHandler> {
	
	public static Type<FormStateEventHandler> TYPE = new Type<FormStateEventHandler>();
	
	public enum EventType { ON_SEND, ON_RESET }
	
	private final EventType type;
	public FormStateEvent(EventType type){
		this.type = type;
	}
	
	
	@Override
	public Type<FormStateEventHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(FormStateEventHandler handler) {
		if( this.type.equals( EventType.ON_SEND ) ){
			handler.onSend();
		} else if( this.type.equals( EventType.ON_RESET ) ){
			handler.onClear();
		}
	}


	public static Type<FormStateEventHandler> getType() {
		return TYPE;
	}

}
