package com.google.gwt.websocket.client;

import com.google.gwt.core.client.JavaScriptObject;

public class SocketMessage extends JavaScriptObject {
	
	protected SocketMessage(){}
	
	public static final native SocketMessage create(String message) /*-{
		return {
			data: message,
			isSent: true,
			created: Date.now()
		}
	}-*/;
	
	public final native boolean isMessageIsSent() /*-{
		return !!(this.isSent);
	}-*/;
	
	public final native double getCreated() /*-{
		if(!this.created){
			this.created = Date.now();
		}
		return this.created;
	}-*/;
	
	/**
	 * 
	 * @return Message received by socket or NULL if there is no string message.
	 */
	public final native String getStringMessage() /*-{
		if(typeof this.data == "string") return this.data;
		return null;
	}-*/;
	public final native String toJSON() /*-{
		return JSON.stringify(this);
	}-*/;
}
