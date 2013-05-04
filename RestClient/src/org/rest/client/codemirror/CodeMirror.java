package org.rest.client.codemirror;

import com.google.gwt.user.client.Element;

public class CodeMirror {
	private final CodeMirrorImpl impl;
	
	
	protected CodeMirror(CodeMirrorImpl inst) {
		impl = inst;
	}
	
	public CodeMirrorImpl getInstance(){
		return impl;
	}

	/**
	 * Initialize CodeMirror library.
	 * 
	 * @param element
	 * @param options
	 *            it is safe to pass a NULL for default values.
	 * @return
	 */
	public static CodeMirror fromTextArea(Element element,
			CodeMirrorOptions options) {
		CodeMirrorImpl inst = CodeMirrorImpl.fromTextArea(element, options);
		return new CodeMirror(inst);
	}
	
	/**
	 * Initialize CodeMirror library.
	 * 
	 * @param element
	 * @param options
	 *            it is safe to pass a NULL for default values.
	 * @return
	 */
	public static CodeMirror fromTextArea(Element element,
			CodeMirrorOptions options, CodeMirrorChangeHandler changeHandler) {
		
		CodeMirrorImpl inst = CodeMirrorImpl.fromTextArea(element, options, changeHandler);
		return new CodeMirror(inst);
	}
	
	/**
	 * Get the current editor content. 
	 * 
	 * @return
	 */
	public String getValue() {
		return getValue("\n");
	}
	/**
	 * Get the current editor content. 
	 * 
	 * @param separator Specify the string to be used to separate lines (defaults to "\n").
	 * @return
	 */
	public String getValue(String separator) {
		return impl.getValue(separator);
	}
	/**
	 * Set the editor content.
	 * @param value
	 */
	public void setValue(String value){
		impl.setValue(value);
	}
	
	public void refresh(){
		impl.refresh();
	}
	
	public void toTextArea(){
		impl.toTextArea();
	}
	/**
	 * Set editor option
	 * @param option Option name to change
	 * @param value Value for the option
	 */
	public void setOption(String option, String value){
		
		impl.setOption(option, value);
	}
}
