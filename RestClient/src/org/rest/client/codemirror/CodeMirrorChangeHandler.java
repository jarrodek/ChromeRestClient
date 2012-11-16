package org.rest.client.codemirror;

public interface CodeMirrorChangeHandler {
	/**
	 * When given, this function will be called every time for the keyup event in editor.
	 */
	void onChage();
}
