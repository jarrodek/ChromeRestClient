package com.restclient.client.html5;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.user.client.Element;
import com.google.gwt.user.client.ui.FileUpload;
import com.google.gwt.xhr2.client.FileList;

public class HTML5FileUpload extends FileUpload {
	
	public HTML5FileUpload(){
		super();
	}
	/**
	 * Get filelist javascript object.
	 * 
	 * @return list of files OR <b>null</b> on empty or not exists
	 */
	public FileList getFiles(){
		FileList list = FileList.create(getElement());
		if( list.size() == 0 ){
			return null;
		}
		return list;
	}
	
	public final native JavaScriptObject _getFiles(Element element) /*-{
		var f = element.files;
		$wnd.console.log(f);
		return f;
	}-*/;
	
	public void setAccept(String accept){
		getElement().setAttribute("accept", accept);
	}
	public void setAcceptAll(){
		getElement().removeAttribute("accept");
	}
	public void setMultiple(boolean state){
		if( state ){
			getElement().setAttribute("multiple", "true");
		} else {
			getElement().removeAttribute("multiple");
		}
	}
}
