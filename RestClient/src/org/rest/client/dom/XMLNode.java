package org.rest.client.dom;

import com.google.gwt.core.client.JsArray;
import com.google.gwt.dom.client.Node;

public class XMLNode extends Node {
	protected XMLNode(){}
	
	
	public final native JsArray<NodeAttribute> getAttributes() /*-{
		
//		if( this.attributes == null || this.attributes.length == 0 ){
//			return null;
//		}
//		var cnt = this.attributes.length;
//		for( var i = 0; i<cnt; i++ ){
//			
//		}
		return this.attributes;
	}-*/;
	
}
