package org.rest.client;

public enum ShortcutType {
	/**
	 * Shortcut for open request dialog.
	 */
	OPEN_REQUEST("OPEN_REQUEST"),
	/**
	 * Shortcut to handle save request action
	 */
	SAVE_REQUEST("SAVE_REQUEST"),
	/**
	 * Shortcut to handle send request action
	 */
	SEND_REQUEST("SEND_REQUEST"),
	/**
	 * Show history tab
	 */
	HISTORY_TAB("HISTORY_TAB");
	
	private final String type;
	ShortcutType(String type){
		this.type = type;
	}
	
	public String getType(){
		return type;
	}
	
	@Override
	public String toString() {
		return type;
	}
}
