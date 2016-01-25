package org.rest.client.codemirror;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.dom.client.Element;

public class CodeMirrorImpl extends JavaScriptObject {
	protected CodeMirrorImpl(){}
	
	
	static final native CodeMirrorImpl fromTextArea(Element element, JavaScriptObject options) /*-{
		return $wnd.CodeMirror.fromTextArea(element, options);
	}-*/;
	
	static final native CodeMirrorImpl fromTextArea(Element element, JavaScriptObject options, CodeMirrorChangeHandler handler) /*-{
		options.onKeyEvent = $entry(function(inst, event){
			if(event.type == 'keyup'){
				var keys = [0,16,17,20,27,33,34,35,36,37,38,39,40,45,91];
				if(keys.indexOf(event.keyCode) !== -1) return;
				handler.@org.rest.client.codemirror.CodeMirrorChangeHandler::onChage()();
			}
		});
		var inst = $wnd.CodeMirror.fromTextArea(element, options);
		if(!$wnd.arc__cainstances){
			$wnd.arc__cainstances = [];
		}
		$wnd.arc__cainstances.push(inst);
		return inst;
	}-*/;


	final native String getValue(String separator) /*-{
		return this.getValue(separator);
	}-*/;
	
	final native String setValue(String value) /*-{
		this.setValue(value);
		var editor = this;
		$wnd.setTimeout(function() {
        	editor.refresh();
        }, 100);
	}-*/;


	final native void refresh() /*-{
		this.refresh();
	}-*/;


	final native void toTextArea() /*-{
		this.toTextArea();
	}-*/;
	
	final native void setOption(String option, String value) /*-{
		this.setOption(option, value);
	}-*/;
	
	
}
