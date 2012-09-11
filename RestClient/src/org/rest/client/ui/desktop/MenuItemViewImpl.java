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

import org.rest.client.resources.AppCssResource;
import org.rest.client.resources.AppResources;
import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.html5.HTML5Element;
import org.rest.client.ui.html5.ListItem;
import org.rest.client.ui.html5.ListPanel;

import com.allen_sauer.gwt.log.client.Log;
import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Element;
import com.google.gwt.dom.client.Style;
import com.google.gwt.dom.client.Style.FontStyle;
import com.google.gwt.dom.client.Style.Unit;
import com.google.gwt.event.dom.client.ClickEvent;
import com.google.gwt.event.dom.client.ClickHandler;
import com.google.gwt.event.dom.client.MouseOutEvent;
import com.google.gwt.event.dom.client.MouseOutHandler;
import com.google.gwt.event.dom.client.MouseOverEvent;
import com.google.gwt.event.dom.client.MouseOverHandler;
import com.google.gwt.place.shared.Place;
import com.google.gwt.resources.client.CssResource;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Label;
import com.google.gwt.user.client.ui.Widget;

public class MenuItemViewImpl extends Composite implements MenuItemView,
		ClickHandler, MouseOutHandler, MouseOverHandler {
	private static RequestViewImplUiBinder uiBinder = GWT
			.create(RequestViewImplUiBinder.class);

	interface RequestViewImplUiBinder extends
			UiBinder<Widget, MenuItemViewImpl> {
	}
	
	
	interface WidgetStyle extends CssResource {
		String selected();
		String hover();
	}

	private HTML5Element _element = null;
	private Place place = null;
	private Presenter listener = null;
	private ArrayList<Widget> children = new ArrayList<Widget>();
	private ListPanel childrenPanel;
	private Label emptyLabel = null;
	
	@UiField WidgetStyle style;
	
	
	/**
	 * Parent menu
	 */
	private MenuItemViewImpl parent;
	/**
	 * Has not null value if this item is in top level of menu
	 */
	private MenuView root;
	
	@UiField ListItem mainListItem;
	private AppCssResource appStyle;
	
	
	public MenuItemViewImpl() {
		appStyle = AppResources.INSTANCE.appCss();
		initWidget(uiBinder.createAndBindUi(this));
		_element = (HTML5Element) getElement();

		getElement().setAttribute("aria-selected", "false");
		getElement().setAttribute("role", "tab");

		addDomHandler(this, ClickEvent.getType());
		addDomHandler(this, MouseOverEvent.getType());
		addDomHandler(this, MouseOutEvent.getType());
	}
	
	
	
	@Override
	public void addChild(Widget item) {
		if(emptyLabel != null && !item.equals(emptyLabel)){
			emptyLabel.removeFromParent();
			emptyLabel = null;
		}
		maybeRemoveItemFromParent(item);
		add(item);
		children.add(item);
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
		if(childrenPanel == null){
			childrenPanel = new ListPanel();
			mainListItem.add(childrenPanel);
		}
		childrenPanel.add(w);
	}

	@Override
	public void clear() {
		mainListItem.clear();
	}

	@Override
	public Iterator<Widget> iterator() {
		return mainListItem.iterator();
	}

	@Override
	public boolean remove(Widget w) {
		return mainListItem.remove(w);
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
		if(isSelected && root != null){
			root.deselectCurrent();
		}
		getElement().setAttribute("aria-selected", String.valueOf(isSelected));
		if(isSelected)
			addStyleName(style.selected());
		else
			removeStyleName(style.selected());
	}

	@Override
	public void setOpened(boolean isOpened) {
		if(children.size() == 0) return;
		if(isOpened){
			childrenPanel.removeStyleName(appStyle.hidden());
		} else {
			childrenPanel.addStyleName(appStyle.hidden());
		}
	}

	public boolean isOpened(){
		if(children.size() == 0) return false;
		return !childrenPanel.getStyleName().contains(appStyle.hidden());
	}
	
	
	@Override
	public void onClick(ClickEvent event) {
		event.stopPropagation();
		event.preventDefault();
		
		Element e = event.getNativeEvent().getCurrentEventTarget().cast();
		if(!(e != null && e.equals(getElement()))) return;
		
		if (children.size() > 0) {
			setOpened(!isOpened());
		} else {
			if (place != null && listener != null) {
				listener.goTo(place);
			} else {
				//open and show "empty" info
				if(emptyLabel == null){
					emptyLabel = new Label("empty");
					Style labelStyle = emptyLabel.getElement().getStyle();
					labelStyle.setColor("#7C7C7C");
					labelStyle.setMarginLeft(14, Unit.PX);
					labelStyle.setMarginTop(14, Unit.PX);
					labelStyle.setFontStyle(FontStyle.ITALIC);
					addChild(emptyLabel);
				}
				setOpened(true);
				Log.debug("Something is wrong .. " + (place != null) + ", " + (listener != null) );
			}
		}
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

	private void maybeRemoveItemFromParent(Widget item) {
		if(item instanceof MenuItemView){
			MenuItemView _item = (MenuItemView)item;
			if (_item.getParentItem() != null) {
				_item.remove();
			}
		} else {
			if(item.getParent()!=null){
				item.removeFromParent();
			}
		}
	}

	@Override
	public MenuItemView getParentItem() {
		return parent;
	}



	@Override
	public void setRoot(MenuView root) {
		this.root = root;
	}



	@Override
	public void onMouseOver(MouseOverEvent event) {
		if(children.size() > 0) return;
		addStyleName(style.hover());
	}

	@Override
	public void onMouseOut(MouseOutEvent event) {
		removeStyleName(style.hover());
	}
	
	public void setData(String key, String value){
		getElement().setAttribute("data-"+key, value);
	}
}
