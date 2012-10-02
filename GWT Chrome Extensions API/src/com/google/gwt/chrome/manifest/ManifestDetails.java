package com.google.gwt.chrome.manifest;

import com.google.gwt.core.client.JavaScriptObject;

public class ManifestDetails extends JavaScriptObject {
	protected ManifestDetails() {
	}
	/**
	 * 
	 * @return The version of the extension/app
	 */
	public final native String getVersion() /*-{
		return this.version;
	}-*/;
	/**
	 * 
	 * @return The name of the extension/app
	 */
	public final native String getName() /*-{
		return this.name;
	}-*/;
	/**
	 * 
	 * @return Extension/app permissions array or null
	 */
	public final native String[] getPermissions() /*-{
		return this.permissions || null;
	}-*/;
	/**
	 * 
	 * @return Extension/app manifest version or null
	 */
	public final native Integer getManifestVersion() /*-{
		return this.manifest_version || null;
	}-*/;
}
