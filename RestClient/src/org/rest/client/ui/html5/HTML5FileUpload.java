/*******************************************************************************
 * Copyright 2012 Paweł Psztyć
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *   http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 ******************************************************************************/
package org.rest.client.ui.html5;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.file.client.FileList;
import com.google.gwt.dom.client.Element;
import com.google.gwt.user.client.ui.FileUpload;

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
		if(list.size() == 0){
			return null;
		}
		return list;
	}
	
	public final native JavaScriptObject _getFiles(Element element) /*-{
		var f = element.files;
//		$wnd.tmp_file = f;
//		$wnd.console.log(f);
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
