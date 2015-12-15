package com.google.gwt.chrome.message;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * This class represents a message from the content script.
 * 
 * Note: There are two systems of message passing: old one and new one.
 * This class supports new system only.
 *  
 * @author Pawel Psztyc
 *
 */
public class ContentScriptResponse extends JavaScriptObject {
	protected ContentScriptResponse(){}
	/**
	 * Check if this is a message from new system.
	 * Note that you must load an extension from DevExtension/ directory to use this API.
	 * @return True if this message comes from the new system.
	 */
	public final native Boolean isValid() /*-{
		return (this.source && this.source === "gwt:cs");
	}-*/;
	/**
	 * Get the original request key for callback function.
	 * @return callback key for the request
	 */
	public final native String getCallbackKey() /*-{
		var original = this["source-data"];
		var params = "";
		if(typeof original.params !== 'undefined'){
			params = original.params;
		}
		var obj = {
			fn: original.payload,
			params: params 
		};
		return JSON.stringify(obj);
	}-*/;
	/**
	 * @return result from the background page.
	 */
	public final native Object getResult() /*-{
		if(typeof this.result === 'undefined'){
			return null;
		}
		return this.result;
	}-*/;
}
