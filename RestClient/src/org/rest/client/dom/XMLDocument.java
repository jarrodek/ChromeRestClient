package org.rest.client.dom;

import com.google.gwt.dom.client.Document;

/**
 * XMLHttpRequest can return XML response. This implementation add some
 * additional accessors to XML document object
 * 
 * @author jarrod
 * 
 */
public class XMLDocument extends Document {
	protected XMLDocument() {
	}

	/**
	 * The XML document encoding property
	 * 
	 * @return the xml's document encoding, or <code>null</code> if none exists
	 */
	public final native String getXmlEncoding() /*-{
		return this.xmlEncoding;
	}-*/;
	
	/**
	 * The XML document Standalone property
	 * 
	 * @return the document's Standalone property value, or <code>null</code> if none exists
	 */
	public final native boolean getXmlStandalone() /*-{
		return this.xmlStandalone;
	}-*/;
	/**
	 * The XML document version property
	 * 
	 * @return the document's XML version, or <code>null</code> if none exists
	 */
	public final native String getXmlVersion() /*-{
		return this.xmlVersion;
	}-*/;
}
