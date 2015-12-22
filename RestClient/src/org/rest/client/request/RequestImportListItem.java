package org.rest.client.request;

import java.util.Date;

import com.google.gwt.core.client.JavaScriptObject;

public class RequestImportListItem extends JavaScriptObject {
	protected RequestImportListItem(){}

	/**
	 * @return the key
	 */
	public final native String getKey() /*-{
		return this.key;
	}-*/;

	/**
	 * @return the name
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;

	/**
	 * @return the url
	 */
	public final native String getUrl() /*-{
		return this.url;
	}-*/;

	/**
	 * @return the created
	 */
	public final native Date getCreated() /*-{
		return new Date(this.created);
	}-*/;
	
}
