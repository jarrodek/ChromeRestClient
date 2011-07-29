package com.restclient.client.html5;

import com.google.gwt.core.client.JavaScriptObject;

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
