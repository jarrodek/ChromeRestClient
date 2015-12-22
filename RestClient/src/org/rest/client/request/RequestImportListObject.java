package org.rest.client.request;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class RequestImportListObject extends JavaScriptObject {
	protected RequestImportListObject(){}
	
	/**
	 * @return List of suggested to import objects.
	 */
	public final native JsArray<RequestImportListItem> getItems() /*-{
		return this;
	}-*/;
	/**
	 * @return true if there was an error during the request.
	 */
	public final native boolean isError() /*-{
		if(typeof this.error === 'undefined'){
			return false;
		}
		return this.error;
	}-*/;
	/**
	 * @return the error message if {@link #isError()} return true, null otherwise
	 */
	public final native String getMessage() /*-{
		if(typeof this.message === 'undefined'){
			return null;
		}
		return this.message;
	}-*/;
}
