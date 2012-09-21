package com.google.gwt.file.client;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * This class represents raw data. It provides a method to slice data objects
 * between ranges of bytes into further chunks of raw data. It also provides an
 * attribute representing the size of the chunk of data. The {@link File} interface
 * inherits from this interface.
 * <p>
 * See <a href="http://dev.w3.org/2006/webapi/FileAPI/#dfn-Blob"
 * >http://dev.w3.org/2006/webapi/FileAPI/#dfn-Blob</a>
 * </p>
 * @author jarrod
 * 
 */
public class Blob extends JavaScriptObject {

	protected Blob() {
	}

	public final native Double getSize()/*-{
		return this.size;
	}-*/;

	public final native String getType()/*-{
		return this.type;
	}-*/;

	// slice Blob into byte-ranged chunks
	public final native Blob slice(Double start, Double length,
			String contentType) /*-{
		return this.slice(start, length, contentType);
	}-*/;

	// slice Blob into byte-ranged chunks
	public final native Blob slice(Double start, Double length) /*-{
		return this.slice(start, length);
	}-*/;
}
