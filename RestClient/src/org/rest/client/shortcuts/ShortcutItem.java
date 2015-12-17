package org.rest.client.shortcuts;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * A single shortcut item stored in the local storage.
 * 
 * TODO: replace it with Chrome API.
 * @deprecated this class and whole mechanism will be replaced with Chrome API.
 * @author Pawel Psztyc
 *
 */
public class ShortcutItem extends JavaScriptObject {
	protected ShortcutItem() {
	};
	/**
	 * Create an instance of an overlay JS object.
	 * This is only method to create an instance of this object.
	 * @return Instance of this object
	 */
	public static final native ShortcutItem create() /*-{
		return {};
	}-*/;
	/**
	 * 
	 * @return true if alt key must be pressed
	 */
	public final native boolean isAlt() /*-{
		return this.alt;
	}-*/;

	/**
	 * 
	 * @return true if ctrl key must be pressed
	 */
	public final native boolean isControl() /*-{
		return this.ctrl;
	}-*/;

	/**
	 * 
	 * @return true if shift key must be pressed
	 */
	public final native boolean isShift() /*-{
		return this.shift;
	}-*/;

	/**
	 * 
	 * @return key code associated with this shortcut
	 */
	public final native Integer getKeyCode() /*-{
		return this.key;
	}-*/;

	/**
	 * @return shortcut type (name).
	 */
	public final native String getType() /*-{
		return this.type;
	}-*/;
	/**
	 * Set if alt button must be pressed in order to run this shortcut.
	 * @param alt
	 * @return
	 */
	public final native ShortcutItem setAlt(boolean alt) /*-{
		this.alt = alt;
		return this;
	}-*/;
	/**
	 * Set if ctrl button must be pressed in order to run this shortcut.
	 * @param ctrl
	 * @return
	 */
	public final native ShortcutItem setControl(boolean ctrl) /*-{
		this.ctrl = ctrl;
		return this;
	}-*/;
	/**
	 * Set if shift button must be pressed in order to run this shortcut.
	 * @param shift
	 * @return
	 */
	public final native ShortcutItem setShift(boolean shift) /*-{
		this.shift = shift;
		return this;
	}-*/;
	/**
	 * Set key code associated with this shortcut
	 * @param keyCode keyboard key code.
	 * @return
	 */
	public final native ShortcutItem setKeyCode(int keyCode) /*-{
		this.key = keyCode;
		return this;
	}-*/;
	/**
	 * Set shortcut type (name).
	 * @param type
	 * @return
	 */
	public final native ShortcutItem setType(String type) /*-{
		this.type = type;
		return this;
	}-*/;
}
