package com.kalicinscy.web.restclient.client.events;

import java.util.LinkedHashMap;

import com.google.gwt.event.shared.GwtEvent;


public class HeadersChangedEvent extends GwtEvent<HeadersChangedEventHandler> {
	
	public static Type<HeadersChangedEventHandler> TYPE = new Type<HeadersChangedEventHandler>();
	
	private final LinkedHashMap<String,String> data;
	
	public HeadersChangedEvent(LinkedHashMap<String,String> data){
		this.data = data;
	}
	
	@Override
	public Type<HeadersChangedEventHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(HeadersChangedEventHandler handler) {
		handler.onHeaderChange(this);
	}
	
	public LinkedHashMap<String,String> getHeaders() {
        return this.data;
    }
}
