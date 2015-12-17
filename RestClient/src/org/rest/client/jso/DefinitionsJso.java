package org.rest.client.jso;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class DefinitionsJso extends JavaScriptObject {
	protected DefinitionsJso(){}
	
	/**
	 * @return array of request headers definition
	 */
	public final native JsArray<HeaderDefinitionJso> getRequests() /*-{ return this.requests; }-*/;
	/**
	 * @return array of response headers definition
	 */
	public final native JsArray<HeaderDefinitionJso> getResponses() /*-{ return this.responses; }-*/;
	/**
	 * @return array of status codes definition
	 */
	public final native JsArray<StatusCodeDefinitionJso> getCodes() /*-{ return this.codes; }-*/;
}
