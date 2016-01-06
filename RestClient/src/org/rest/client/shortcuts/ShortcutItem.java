package org.rest.client.shortcuts;

/**
 * A single shortcut item stored in the local storage.
 * 
 * TODO: replace it with Chrome API.
 * @deprecated this class and whole mechanism will be replaced with Chrome API.
 * @author Pawel Psztyc
 *
 */
public class ShortcutItem {
	
	boolean alt = false;
	boolean ctrl = false;
	boolean shift = false;
	int key;
	String type;
	
	/**
	 * 
	 * @return true if alt key must be pressed
	 */
	public boolean isAlt() {
		return this.alt;
	};

	/**
	 * 
	 * @return true if ctrl key must be pressed
	 */
	public boolean isControl() {
		return this.ctrl;
	};

	/**
	 * 
	 * @return true if shift key must be pressed
	 */
	public boolean isShift() {
		return this.shift;
	}

	/**
	 * 
	 * @return key code associated with this shortcut
	 */
	public int getKeyCode() {
		return this.key;
	}

	/**
	 * @return shortcut type (name).
	 */
	public String getType() {
		return this.type;
	}
	/**
	 * Set if alt button must be pressed in order to run this shortcut.
	 * @param alt
	 * @return
	 */
	public ShortcutItem setAlt(boolean alt) {
		this.alt = alt;
		return this;
	}
	/**
	 * Set if ctrl button must be pressed in order to run this shortcut.
	 * @param ctrl
	 * @return
	 */
	public ShortcutItem setControl(boolean ctrl) {
		this.ctrl = ctrl;
		return this;
	}
	/**
	 * Set if shift button must be pressed in order to run this shortcut.
	 * @param shift
	 * @return
	 */
	public ShortcutItem setShift(boolean shift) {
		this.shift = shift;
		return this;
	}
	/**
	 * Set key code associated with this shortcut
	 * @param keyCode keyboard key code.
	 * @return
	 */
	public ShortcutItem setKeyCode(int keyCode) {
		this.key = keyCode;
		return this;
	}
	/**
	 * Set shortcut type (name).
	 * @param type
	 * @return
	 */
	public ShortcutItem setType(String type) {
		this.type = type;
		return this;
	};
}
