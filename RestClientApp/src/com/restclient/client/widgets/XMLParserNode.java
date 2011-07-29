package com.restclient.client.widgets;

import com.google.gwt.user.client.ui.Label;

public class XMLParserNode extends Label {
	
	public static XMLParserNode wrap(com.google.gwt.user.client.Element element){
		XMLParserNode node = new XMLParserNode(element);
		node.onAttach();
		return node;
	}
	
	public XMLParserNode(com.google.gwt.user.client.Element element) {
		super(element);
	}

}
