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


import com.google.gwt.user.client.ui.Widget;


public interface MenuView {
	
	/**
	 * Add new menu item.
	 * @param item
	 * @return menu item position.
	 */
	int addMenuItem(MenuItemView item);
	/**
	 * Get menu item at position.
	 * @param pos Position of menu item.
	 * Note that this is position of child in DOM.
	 * @throws IndexOutOfBoundsException if pos if out of range
	 */
	MenuItemView getMenuItem(int pos);
	/**
	 * Set opened state menu item at position.
	 * @param pos Position of menu item.
	 * Note that this is position of child in DOM.
	 * @throws IndexOutOfBoundsException if pos if out of range
	 */
	void setOpened(int pos);
	/**
	 * Set opened state menu item.
	 * @param item Menu to open
	 */
	void setOpened(MenuItemView item);
	/**
	 * Hide item from view.
	 * @param pos Position of item to hide.
	 * Note that this is position of child in DOM.
	 * @throws IndexOutOfBoundsException if pos if out of range
	 */
	void hideItem(int pos);
	/**
	 * Hide item from view.
	 * @param item to hide
	 */
	void hideItem(MenuItemView item);
	/**
	 * Show hidden item in view
	 * @param pos Position of item to hide.
	 * Note that this is position of child in DOM.
	 * @throws IndexOutOfBoundsException if pos if out of range
	 */
	void showItem(int pos);
	/**
	 * Show hidden item in view
	 * @param item to show.
	 */
	void showItem(MenuItemView item);
	/**
	 * Returns instance as Widget
	 * @param w
	 */
	Widget asWidget();
}
