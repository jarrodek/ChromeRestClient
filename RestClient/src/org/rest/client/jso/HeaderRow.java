package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * IDB value of the HTTP header.
 * 
 * @author jarrod
 * 
 */
public class HeaderRow extends JavaScriptObject {
	/**
	 * Const.
	 */
	protected HeaderRow() {
	}
	
	/**
	 * @return header name
	 */
	public final native String getKey()/*-{
		return this.key;
	}-*/;

	/**
	 * 
	 * @return header's description
	 */
	public final native String getDesc()/*-{
		return this.desc;
	}-*/;

	/**
	 * 
	 * @return header's example
	 */
	public final native String getExample()/*-{
		return this.example||"";
	}-*/;

	/**
	 * 
	 * @return header type
	 */
	public final native String getType()/*-{
		return this.type;
	}-*/;
}
