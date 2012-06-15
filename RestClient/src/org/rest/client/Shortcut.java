package org.rest.client;

import org.rest.client.util.Utils;

import com.google.gwt.json.client.JSONBoolean;
import com.google.gwt.json.client.JSONNumber;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;
import com.google.gwt.json.client.JSONValue;

public class Shortcut {
	
	private ShortcutType type;
	private boolean ctrl = false;
	private boolean shift = false;
	private boolean alt = false;
	private int charCode = -1;
	
	public Shortcut(){
		
	}
	
	/**
	 * @return the type
	 */
	public ShortcutType getType() {
		return type;
	}
	/**
	 * @param type the type to set
	 */
	public void setType(ShortcutType type) {
		this.type = type;
	}
	/**
	 * @return the ctrl
	 */
	public boolean isCtrl() {
		return ctrl;
	}
	/**
	 * @param ctrl the ctrl to set
	 */
	public void setCtrl(boolean ctrl) {
		this.ctrl = ctrl;
	}
	/**
	 * @return the shift
	 */
	public boolean isShift() {
		return shift;
	}
	/**
	 * @param shift the shift to set
	 */
	public void setShift(boolean shift) {
		this.shift = shift;
	}
	/**
	 * @return the alt
	 */
	public boolean isAlt() {
		return alt;
	}
	/**
	 * @param alt the alt to set
	 */
	public void setAlt(boolean alt) {
		this.alt = alt;
	}

	/**
	 * @return the letter
	 */
	public int getCharCode() {
		return charCode;
	}

	/**
	 * @param letter the letter to set
	 */
	public void setCharCode(int charCode) {
		this.charCode = charCode;
	}
	
	public static Shortcut fromJSON(JSONObject obj){
		
		String t = Utils.getJsonString(obj, "t");
		if(t == null){
			return null;
		}
		JSONValue keyValue = obj.get("k");
		if(keyValue == null){
			return null;
		}
		JSONNumber keyNumeric = keyValue.isNumber();
		int keyCode = (int) keyNumeric.doubleValue();
		Shortcut result = new Shortcut();
		if(t.equals("OPEN_REQUEST")){
			result.setType(ShortcutType.OPEN_REQUEST);
		} else if(t.equals("SAVE_REQUEST")){
			result.setType(ShortcutType.SAVE_REQUEST);
		} else if(t.equals("SEND_REQUEST")){
			result.setType(ShortcutType.SEND_REQUEST);
		} else if(t.equals("HISTORY_TAB")){
			result.setType(ShortcutType.HISTORY_TAB);
		}
		result.setCharCode(keyCode);
		
		JSONValue altValue = obj.get("a");
		JSONValue ctrlValue = obj.get("c");
		JSONValue shiftValue = obj.get("s");
		JSONBoolean altBoolean = altValue.isBoolean();
		JSONBoolean ctrlBoolean = ctrlValue.isBoolean();
		JSONBoolean shiftBoolean = shiftValue.isBoolean();
		if(altBoolean != null){
			result.setAlt(altBoolean.booleanValue());
		}
		if(ctrlBoolean != null){
			result.setCtrl(ctrlBoolean.booleanValue());
		}
		if(shiftBoolean != null){
			result.setShift(shiftBoolean.booleanValue());
		}
		
		return result;
	}
	
	/**
	 * @return class value as JSON object
	 */
	public JSONObject toJSON(){
		JSONObject data = new JSONObject();
		
		JSONBoolean alt = JSONBoolean.getInstance(this.alt);
		JSONBoolean ctrl = JSONBoolean.getInstance(this.ctrl);
		JSONBoolean shift = JSONBoolean.getInstance(this.shift);
		JSONNumber keyCode = new JSONNumber(charCode);
		JSONString type = new JSONString(this.type.getType());
		
		data.put("a", alt);
		data.put("c", ctrl);
		data.put("s", shift);
		data.put("k", keyCode);
		data.put("t", type);
		
		return data;
	}
	
	@Override
	public String toString() {
		JSONObject data = this.toJSON();
		return data.toString();
	}
	/**
	 * Shortcut object is equal if type is same.
	 * Values are relevant. 
	 */
	@Override
	public boolean equals(Object obj) {
		if(!(obj instanceof Shortcut)) return false;
		Shortcut _obj = (Shortcut)obj;
		
		return this.getType().equals(_obj.getType());
	}
}
