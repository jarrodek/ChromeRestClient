package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;

public final class DriveAuth extends JavaScriptObject {
	protected DriveAuth(){}
	
	public native String getAccessToken() /*-{ 
		return this.access_token; 
	}-*/;
	public native String getState() /*-{ 
		return this.state; 
	}-*/;
	public native String getTokenType() /*-{ 
		return this.token_type; 
	}-*/;
	public native int getExpiresIn() /*-{
		var value = this.expires_in || 0;
		try{
			value = parseInt(this.expires_in, 10);
		} catch(e){}
		return value; 
	}-*/;
}