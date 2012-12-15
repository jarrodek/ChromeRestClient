package org.rest.client.gdrive.api;

import com.google.gwt.core.client.JavaScriptObject;

/**
 * Thumbnail is an enumerated type used to convey information about a picker
 * photo or video. This value can be found in the Document.THUMBNAILS field of a
 * picked Document.
 * 
 * @author jarrod
 * 
 */
public class PickerThumbnail extends JavaScriptObject {
	protected PickerThumbnail() {
	}

	/**
	 * 
	 * @return The height of the photo or video in pixels.
	 */
	public final native Integer getHeight() /*-{
		return this[$wnd.google.picker.Thumbnail.HEIGHT] || null;
	}-*/;

	/**
	 * 
	 * @return The width of the photo or video in pixels.
	 */
	public final native Integer getWidth() /*-{
		return this[$wnd.google.picker.Thumbnail.WIDTH] || null;
	}-*/;

	/**
	 * 
	 * @return A URL to the selected photo or video.
	 */
	public final native String getUrl() /*-{
		return this[$wnd.google.picker.Thumbnail.URL] || null;
	}-*/;
}