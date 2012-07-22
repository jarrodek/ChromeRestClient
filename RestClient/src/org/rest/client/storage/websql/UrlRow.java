package org.rest.client.storage.websql;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing single row of URLs database table.
 * 
 * @author Paweł Psztyć
 * 
 */
public class UrlRow extends JavaScriptObject {
	/**
	 * Empty.
	 */
	protected UrlRow() {
	}

	public final static native UrlRow create() /*-{
		return {
			url : null,
			time : Date.now()
		};
	}-*/;

	public final native void setUrl(String url) /*-{
		this.url = url;
	}-*/;

	public final native void setTime(double time) /*-{
		this.time = time;
	}-*/;

	/**
	 * Native getUrl.
	 * 
	 * @return url string
	 */
	public final native String getUrl()/*-{
		return this.url;
	}-*/;

	/**
	 * @return
	 */
	public final native double getTime()/*-{
		return this.time;
	}-*/;

	public final native int getId()/*-{
		return this.id;
	}-*/;
}
