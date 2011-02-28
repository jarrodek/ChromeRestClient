package com.kalicinscy.web.restclient.client.events;

import com.google.gwt.event.shared.GwtEvent;


public class PostDataChangedEvent extends GwtEvent<PostDataChangedEventHandler> {
	
	public static Type<PostDataChangedEventHandler> TYPE = new Type<PostDataChangedEventHandler>();
	
	private final String data;
	
	public PostDataChangedEvent(String data){
		this.data = data;
	}
	
	
	@Override
	public Type<PostDataChangedEventHandler> getAssociatedType() {
		return TYPE;
	}

	@Override
	protected void dispatch(PostDataChangedEventHandler handler) {
		handler.onDataChange(this);
	}
	
	public String getData() {
        return this.data;
    }
}
