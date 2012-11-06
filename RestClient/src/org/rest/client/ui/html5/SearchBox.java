package org.rest.client.ui.html5;

import com.google.gwt.user.client.ui.TextBox;

public class SearchBox extends TextBox {
	
	public SearchBox() {
		super();
		getElement().setAttribute("type", "search");
		getElement().setAttribute("placeholder", "search...");
	}

}
