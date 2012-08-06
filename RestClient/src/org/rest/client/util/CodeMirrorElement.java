package org.rest.client.util;

import com.google.gwt.safehtml.shared.SafeHtmlUtils;

public class CodeMirrorElement {
	private final String string;
	private final String style;
	
	public CodeMirrorElement(String string, String style){
		this.string = string;
		this.style = style;
	}

	/**
	 * @return the string
	 */
	public final String getString() {
		return string;
	}

	/**
	 * @return the style
	 */
	public final String getStyle() {
		return style;
	}
	
	public String parse(){
		String str = getString();
		String style = getStyle();
		String result = "";
		if(str == null){
			return result;
		}
		if(str.equals("\n")){
			//just new line in document
			result = "<br>";
		} else if (style != null) {
			//has parser style
			result = "<span class=\"cm-" + style + "\">" + SafeHtmlUtils.fromString(str).asString() + "</span>";
		} else {
			//text node
			result = SafeHtmlUtils.fromString(str).asString();
		}
		return result;
	}
}
