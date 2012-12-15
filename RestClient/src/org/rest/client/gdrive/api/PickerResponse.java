package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class PickerResponse extends JavaScriptObject {
	protected PickerResponse() {
	}
	
	public static final String ACTION_CANCEL = "cancel";
	public static final String ACTION_PICKED = "picked";
	
	/**
	 * Action is an enumerated type representing the action taken by the user to
	 * dismiss the dialog. This value will in the Response.ACTION field in the
	 * callback data.
	 * 
	 * <p>
	 * 	It can be either {@link #ACTION_CANCEL} or {@link #ACTION_PICKED}
	 * </p>
	 * 
	 * @return The Action taken by the user to close the picker dialog.
	 */
	public final native String getAction() /*-{
		return this[$wnd.google.picker.Response.ACTION] || null;
	}-*/;

	/**
	 * Document is an enumerated type used to convey information about a
	 * specific picked item. Only fields which are relevant to the selected item
	 * are returned. This value will be in the Response.DOCUMENTS field in the
	 * callback data.
	 * 
	 * @return A document array or NULL
	 */
	public final native JsArray<PickerDocument> getDocuments() /*-{
		return this[$wnd.google.picker.Response.DOCUMENTS] || null;
	}-*/;
}