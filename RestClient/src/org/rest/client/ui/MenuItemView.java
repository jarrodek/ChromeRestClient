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
package org.rest.client.ui;

import com.google.gwt.place.shared.Place;
import com.google.gwt.user.client.ui.HasHTML;
import com.google.gwt.user.client.ui.HasText;
import com.google.gwt.user.client.ui.HasWidgets;
import com.google.gwt.user.client.ui.Widget;

public interface MenuItemView extends HasText, HasWidgets, HasHTML {
	/**
	 * Presenter interface
	 * @author Paweł Psztyć
	 *
	 */
	public interface Presenter {
		/**
		 * Change place
		 * @param place
		 */
		void goTo(Place place);
	}
	/**
	 * Sets presenter for this view
	 * @param listener
	 */
	void setPresenter(Presenter listener);
	
	void addChild(MenuItemView item);
	/**
	 * Set place name where menu will point to.
	 * @param place
	 */
	void setPlace(Place place);
	/**
	 * Set display name
	 * @param text
	 */
	void setText(String text);
	/**
	 * Set selected/deselect state for this control
	 * @param isSelected
	 */
	void setSelected(boolean isSelected);
	/**
	 * Show/hide children (if any)
	 * @param isOpened
	 */
	void setOpened(boolean isOpened);
	/**
	 * Set menu top object. Only for first level children.
	 * @param root
	 */
	void setRoot(MenuView root);
	public MenuItemView getParentItem();

	void remove();
	
	Widget asWidget();
}
