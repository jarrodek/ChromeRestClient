package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptObject;

public final class DriveError extends JavaScriptObject {
	protected DriveError(){}
	
	public native int getCode() /*-{
		return this.code;
	}-*/;
	public native int getMessage() /*-{
		return this.message;
	}-*/;
	
//	code: 401
//	message: "Invalid Credentials"
//	errors: Array[1]
//		0: Object
//			domain: "global"
//			location: "Authorization"
//			locationType: "header"
//			message: "Invalid Credentials"
//			reason: "authError"
}
