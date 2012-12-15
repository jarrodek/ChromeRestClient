package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

public class PickerDocument extends JavaScriptObject {
	protected PickerDocument(){}
	
	/**
	 * 
	 * @return A user-contributed description of the picked item.
	 */
	public final native String getDescription() /*-{
		return this[$wnd.google.picker.Document.DESCRIPTION] || null; 
	}-*/;
	/**
	 * 
	 * @return A URL for this item suitable for embedding in a web page.
	 */
	public final native String getEmbedUrl() /*-{
		return this[$wnd.google.picker.Document.EMBEDDABLE_URL] || null; 
	}-*/;
	/**
	 * 
	 * @return A URL to an icon for this item.
	 */
	public final native String getIconUrl() /*-{
		return this[$wnd.google.picker.Document.ICON_URL] || null; 
	}-*/;
	/**
	 * 
	 * @return The id for the picked item.
	 */
	public final native String getId() /*-{
		return this[$wnd.google.picker.Document.ID] || null; 
	}-*/;
	/**
	 * 
	 * @return The timestamp describing when this item was last edited.
	 */
	public final native Long getLastEditedUtc() /*-{
		return this[$wnd.google.picker.Document.LAST_EDITED_UTC] || null; 
	}-*/;
	/**
	 * 
	 * @return The MIME type of this item.
	 */
	public final native String getMimeType() /*-{
		return this[$wnd.google.picker.Document.MIME_TYPE] || null; 
	}-*/;
	/**
	 * 
	 * @return The name of this item.
	 */
	public final native String getName() /*-{
		return this[$wnd.google.picker.Document.NAME] || null; 
	}-*/;
	/**
	 * 
	 * @return A ServiceId describing the service this item was picked from.
	 */
	public final native String getServiceId() /*-{
		return this[$wnd.google.picker.Document.SERVICE_ID] || null; 
	}-*/;
	/**
	 * 
	 * @return The Type of the picked item.
	 */
	public final native String getType() /*-{
		return this[$wnd.google.picker.Document.TYPE] || null; 
	}-*/;
	/**
	 * 
	 * @return An array of Thumbnails which describe the attributes of a photo or video.
	 */
	public final native JsArray<PickerThumbnail> getThumbnails() /*-{
		return this[$wnd.google.picker.Document.THUMBNAILS] || null; 
	}-*/;
	/**
	 * 
	 * @return A URL to this item.
	 */
	public final native String getUrl() /*-{
		return this[$wnd.google.picker.Document.URL] || null; 
	}-*/;
}