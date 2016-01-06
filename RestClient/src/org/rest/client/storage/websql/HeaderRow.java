package org.rest.client.storage.websql;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Class representing database header table row.
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
	public final native String getName()/*-{
		return this.name;
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
