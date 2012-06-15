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

import org.rest.client.ui.MenuItemView;
import org.rest.client.ui.MenuView;
import org.rest.client.ui.html5.ListPanel;

import com.google.gwt.core.client.GWT;
import com.google.gwt.dom.client.Style.Display;
import com.google.gwt.uibinder.client.UiBinder;
import com.google.gwt.uibinder.client.UiField;
import com.google.gwt.user.client.Event;
import com.google.gwt.user.client.ui.Accessibility;
import com.google.gwt.user.client.ui.Composite;
import com.google.gwt.user.client.ui.Widget;

public class MenuViewImpl extends Composite implements MenuView {
	private static RequestViewImplUiBinder uiBinder = GWT
			.create(RequestViewImplUiBinder.class);

	interface RequestViewImplUiBinder extends UiBinder<Widget, MenuViewImpl> {
	}
	
	
	
	@UiField ListPanel root;
	private int childrenCount = 0;
	
	
	
	public MenuViewImpl() {
		initWidget(uiBinder.createAndBindUi(this));
		
		sinkEvents(Event.ONMOUSEDOWN | Event.ONCLICK | Event.KEYEVENTS);
		Accessibility.setRole(getElement(), Accessibility.ROLE_TREE);
		
	}
	
	

	@Override
	public int addMenuItem(MenuItemView item) {
		item.setRoot(this);
		root.add(item.asWidget());
		childrenCount++;
		return root.getWidgetCount()-1;
	}
	


	@Override
	public MenuItemView getMenuItem(int pos) {
		return (MenuItemView) root.getWidget(pos);
	}


	@Override
	public void setOpened(int pos) {
		if(pos + 1 < childrenCount) return;
		((MenuItemView) root.getWidget(pos)).setOpened(true);
	}


	@Override
	public void setOpened(MenuItemView item) {
		
		int cnt = root.getWidgetCount();
		for(int i = 0; i<cnt; i++){
			Widget w = root.getWidget(i);
			if(w instanceof MenuItemView){
				if(((MenuItemView) w).equals(item)){
					item.setOpened(true);
					break;
				}
			}
		}
		
	}


	@Override
	public void hideItem(int pos) {
		root.getWidget(pos).getElement().getStyle().setDisplay(Display.NONE);
	}


	@Override
	public void hideItem(MenuItemView item) {
		for(Widget i : root){
			if(i.equals(item)){
				i.getElement().getStyle().setDisplay(Display.NONE);
				break;
			}
		}
	}


	@Override
	public void showItem(int pos) {
		root.getWidget(pos).getElement().getStyle().setDisplay(Display.BLOCK);
	}


	@Override
	public void showItem(MenuItemView item) {
		for(Widget i : root){
			if(i.equals(item)){
				i.getElement().getStyle().setDisplay(Display.BLOCK);
				break;
			}
		}
	}



	@Override
	public void deselectCurrent() {
		int cnt = root.getWidgetCount();
		for(int i = 0; i<cnt; i++){
			Widget w = root.getWidget(i);
			if(w instanceof MenuItemView){
				MenuItemView mi = (MenuItemView) w;
				mi.setSelected(false);
			}
		}
	}


//	@Override
//	public Widget asWidget() {
//		return super.asWidget();
//	}
	
	
}
