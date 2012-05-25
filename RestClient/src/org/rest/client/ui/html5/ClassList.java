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

import com.google.gwt.core.client.JavaScriptObject;
/**
 * Class list is new elements attribute in HTML5.
 * Via classList property can access to element class property and manipulate them.
 * This class is GWT wrapper to HTML5 classList property.
 * @author Paweł Psztyć
 *
 */
public class ClassList extends JavaScriptObject {
	protected ClassList() {
	}
	/**
	 * Add class name to element.
	 * 
	 * @param className
	 */
	public final native void add(String className) /*-{
		this.add(className);
	}-*/;
	/**
	 * 
	 * @return count of class names elements
	 */
	public final native int getSize() /*-{
		return this.length;
	}-*/;
	/**
	 * Check if element already has a class name.
	 * @param className
	 * @return
	 */
	public final native boolean contains(String className) /*-{
		return this.contains(className);
	}-*/;
	/**
	 * Removes given class name from elements class list.
	 * @param className
	 */
	public final native void remove(String className) /*-{
		this.remove(className);
	}-*/;
	/**
	 * Get class name in zero-based position.
	 * <p>
	 * 
	 * <code>
	 * eg class="first sec rd"<br/>
	 * 
	 * HTML5element.getClassList().item(1) return "sec"
	 * </code>
	 * </p>
	 * @param position
	 * @return class name at position
	 */
	public final native String item(int position) /*-{
		this.item(pos);
	}-*/;
	/**
	 * Toggle class name.
	 * @param className
	 * @return
	 */
	public final native String toggle(String className) /*-{
		this.toggle(className);
	}-*/;
}
