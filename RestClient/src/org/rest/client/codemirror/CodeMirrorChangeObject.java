package org.rest.client.codemirror;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Object passed to code mirror change handler. It is an {from, to, text, next}
 * object containing information about the changes that occurred. 
 * from and to are the positions (in the pre-change coordinate system)
 * where the change started and ended (for example, it might be {ch:0, line:18}
 * if the position is at the beginning of line #19). text is an array of strings
 * representing the text that replaced the changed range (split by line). If
 * multiple changes happened during a single operation, the object will have a
 * next property pointing to another change object (which may point to another,
 * etc).
 * 
 * @author jarrod
 * 
 */
public class CodeMirrorChangeObject extends JavaScriptObject {
	protected CodeMirrorChangeObject() {
	}
	/**
	 * 
	 * @return the positions (in the pre-change coordinate system) where the change started
	 */
	public final native int getFromCharacter() /*-{
		return this.from.ch;
	}-*/;
	/**
	 * 
	 * @return the positions (in the pre-change coordinate system) where the change started
	 */
	public final native int getFromLine() /*-{
		return this.from.line;
	}-*/;

	public final native int getToCharacter() /*-{
		return this.to.ch;
	}-*/;
	public final native int getToLine() /*-{
		return this.to.line;
	}-*/;

	public final native String[] getText() /*-{
		return this.text;
	}-*/;

	public final native CodeMirrorChangeObject getNext() /*-{
		return this.next || null;
	}-*/;
}
