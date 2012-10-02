package com.google.gwt.chrome.extension;

public class Extension {
	
	private Extension(){}
	
	public static Extension getExtensionIfSupported(){
		if(!isSupported()) return null;
		return new Extension();
	}
	
	/**
	 * Check if API is available.
	 * 
	 * @return true if API is available.
	 */
	private static final native boolean isSupported()/*-{
		return !!(chrome.extension);
	}-*/;
	
	/**
	 * Converts a relative path within an extension install directory to a fully-qualified URL.
	 * @param path A path to a resource within an extension expressed relative to its install directory.
	 * @return The fully-qualified URL to the resource.
	 */
	public final native String getURL(String path)/*-{
		return $wnd.chrome.extension.getURL(path);
	}-*/;
}
