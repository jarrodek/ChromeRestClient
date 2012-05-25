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
package org.rest.client.ui.desktop;

import java.util.ArrayList;
import java.util.Iterator;

import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.ListItem;

import com.google.gwt.core.client.GWT;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.place.shared.Place;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class MenuItemViewImpl extends Composite implements MenuItemView,
		ClickHandler {
	private static RequestViewImplUiBinder uiBinder = GWT
			.create(RequestViewImplUiBinder.class);

	interface RequestViewImplUiBinder extends
			UiBinder<Widget, MenuItemViewImpl> {
	}

	private HTML5Element _element = null;
	private Place place = null;
	@UiField
	ListItem root;

	
	private Presenter listener = null;
	private ArrayList<MenuItemViewImpl> children = new ArrayList<MenuItemViewImpl>();
	private MenuItemViewImpl parent;

	public MenuItemViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
		_element = (HTML5Element) getElement();

		getElement().setAttribute("aria-selected", "false");
		getElement().setAttribute("role", "tab");

		addDomHandler(this, ClickEvent.getType());
	}

	@Override
	public void addChild(MenuItemView item) {
		MenuItemViewImpl it = (MenuItemViewImpl) item;
		maybeRemoveItemFromParent(item);
		add(it);
		children.add(it);
	}

	@Override
	public void setPlace(Place place) {
		this.place = place;
	}

	@Override
	public void setText(String text) {
		_element.setInnerText(text);
	}

	@Override
	public String getText() {
		return _element.getInnerText();
	}

	@Override
	public void add(Widget w) {
		root.add(w);

	}

	@Override
	public void clear() {
		root.clear();
	}

	@Override
	public Iterator<Widget> iterator() {
		return root.iterator();
	}

	@Override
	public boolean remove(Widget w) {
		return root.remove(w);
	}

	@Override
	public String getHTML() {
		return _element.getInnerHTML();
	}

	@Override
	public void setHTML(String html) {
		_element.setInnerHTML(html);
	}

	@Override
	public void setSelected(boolean isSelected) {
		getElement().setAttribute("aria-selected", String.valueOf(isSelected));
	}

	@Override
	public void setOpened(boolean isOpened) {
		// TODO Auto-generated method stub

	}

	@Override
	public void onClick(ClickEvent event) {
		GWT.log("Click");
		if (children.size() > 0) {
			GWT.log("Open");
			setOpened(true);
		} else {
			if (place != null && listener != null) {
				GWT.log("Goto place");
				listener.goTo(place);
			} else {
				GWT.log("Something is wrong..");
			}
		}
	}

	@Override
	public void setTabIndex(int tabIndex) {
		getElement().setAttribute("tabindex", String.valueOf(tabIndex));
	}

	@Override
	public void setPresenter(Presenter listener) {
		this.listener = listener;
	}

	@Override
	public void remove() {
		if (parent != null) {
			// If this item has a parent, remove self from it.
			parent.remove(this);
		}
	}

	private void maybeRemoveItemFromParent(MenuItemView item) {
		if (item.getParentItem() != null) {
			item.remove();
		}
	}

	@Override
	public MenuItemView getParentItem() {
		return parent;
	}
}
