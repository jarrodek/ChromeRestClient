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

import com.google.gwt.user.client.DOM;
import com.google.gwt.user.client.ui.ComplexPanel;
import com.google.gwt.user.client.ui.HasHTML;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.Widget;

public class ListItem extends ComplexPanel implements HasHTML, HasText {

	public ListItem() {
		setElement(DOM.createElement("li"));
	}
	
	public ListItem(String text){
		this();
		setText(text);
	}

	@Override
	public void add(Widget w) {
		super.add(w, getElement());
	}
	
	public void insert(Widget w, int beforeIndex) {
		super.insert(w, getElement(), beforeIndex, true);
	}

	@Override
	public String getText() {
		return DOM.getInnerText(getElement());
	}

	@Override
	public void setText(String text) {
		DOM.setInnerText(getElement(), (text == null) ? "" : text);
	}

	@Override
	public String getHTML() {
		return DOM.getInnerHTML(getElement());
	}

	@Override
	public void setHTML(String html) {
		DOM.setInnerHTML(getElement(), (html == null) ? "" : html);
	}

}
