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
	
	public static final native HeaderRow create() /*-{
		return {name:null, desc: null, example: null, type:null};
	}-*/;
	
	public final native void setName(String name) /*-{ this.name = name; }-*/;
	public final native void setDesc(String desc) /*-{ this.desc = desc; }-*/;
	public final native void setExample(String example) /*-{ this.example = example; }-*/;
	public final native void setType(String type) /*-{ this.type = type; }-*/;
	
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
		return this.example;
	}-*/;

	/**
	 * 
	 * @return header type
	 */
	public final native String getType()/*-{
		return this.type;
	}-*/;
}
