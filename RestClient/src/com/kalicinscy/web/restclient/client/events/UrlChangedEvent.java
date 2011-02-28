package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.GwtEvent;

public class UrlChangedEvent extends GwtEvent<UrlChangedEventHandler> {
	
	public static Type<UrlChangedEventHandler> TYPE = new Type<UrlChangedEventHandler>();
	
	private final String url;
	
	public UrlChangedEvent(String url){
		this.url = url;
	}
	
	
	@Override
	public Type<UrlChangedEventHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(UrlChangedEventHandler handler) {
		handler.onUrlChanged(this);
	}
	
	public String getUrl() {
        return this.url;
    }
}
