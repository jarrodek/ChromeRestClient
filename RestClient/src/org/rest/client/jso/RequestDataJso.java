package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

public final class RequestDataJso extends JavaScriptObject {
	protected RequestDataJso(){}
	
	/**
	 * @return AppEngine's database key as string
	 */
	public native String getKey() /*-{
		return this.key;
	}-*/;
	/**
	 * @return URL for the request
	 */
	public native String getUrl() /*-{
		return this.url;
	}-*/;
	/**
	 * @return Request's payload
	 */
	public native String getPayload() /*-{
		return this.post;
	}-*/;
	/**
	 * @return Request name
	 */
	public native String getName() /*-{
		return this.name;
	}-*/;
	/**
	 * @return Request's HTTP method
	 */
	public native String getMethod() /*-{
		return this.method;
	}-*/;
	/**
	 * @return HTTP headers string
	 */
	public native String getHeaders() /*-{
		var data = '';
		if(this.encoding){
			data += 'Content-Type: ' + this.encoding;
		}
		if(this.headers && this.headers.length){
			this.headers.forEach(function(header){
				if(header.key && header.value){
					data += '\n' + header.key + ': ' + header.value;
				}
			});
		}
		return data;
	}-*/;
	
}
