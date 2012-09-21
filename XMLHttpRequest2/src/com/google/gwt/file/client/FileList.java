package com.google.gwt.file.client;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class FileList extends JavaScriptObject {
	
	protected FileList(){}
	
	public static FileList create( Element e ){
		if(e.getNodeName().toLowerCase().equals("input") && e.getAttribute("type").equals("file")){
			return _create(e);
		}
		return null;
	}
	private static native FileList _create(Element e)/*-{
		return e.files;
	}-*/;
	
	public final File get(int i) throws ArrayIndexOutOfBoundsException{
		int size = size();
		if( size - 1 < i ){
			throw new ArrayIndexOutOfBoundsException();
		}
		return _get(i);
	}
	private final native File _get(int i)/*-{
		return this[i];
	}-*/;
	
	public final int size(){
		return getSize();
	}
	private native int getSize()/*-{
		return this.length;
	}-*/;
}
