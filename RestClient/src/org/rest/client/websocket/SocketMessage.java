package org.rest.client.websocket;

import com.google.gwt.core.client.JavaScriptObject;

public class SocketMessage extends JavaScriptObject {
	
	protected SocketMessage(){}
	
	public static native SocketMessage create(String message) /*-{
		this.data = message;
		this.isSent = true;
		this.created = Date.now();
	}-*/;
	
	public final native boolean isMessageIsSent() /*-{
		return !!(this.isSent);
	}-*/;
	
	public final native double getCreated() /*-{
		if(!this.created || !this.created.getTime){
			this.created = Date.now();
		}
		if(typeof this.created == 'number'){
			return this.created;
		}
		return this.created.getTime();
	}-*/;
	
	/**
	 * 
	 * @return Message received by socket or NULL if there is no string message.
	 */
	public final native String getStringMessage() /*-{
		if(typeof this.data == "string") return this.data;
		return null;
	}-*/;
	
}
