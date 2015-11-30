package org.rest.client.gdrive.api;


/**
 * A class responsible for handling Google Drive files using 
 * Google Picker API.
 * It's a wrapper for native JS library.
 * 
 * @example
 * 
 * 
 * @author Pawel Psztyc
 *
 */
public class DrivePicker {
	
	/**
	 * Check if Picker API is loaded.
	 * @return True if picker API is available.
	 */
	private static final native boolean isLoaded() /*-{
		if(typeof $wnd.google === "undefined") return false;
		if(typeof $wnd.google.picker === "undefined") return false;
		return true;
	}-*/;
	
	/**
	 * Before Drive file picker can be used the app need to download picker's libraries.
	 * This function will load required libraries and call event listener when done.
	 * 
	 * This method will call arc.app.drive.picker.load function from drive.js library.
	 *  
	 * @param handler
	 */
	public static final native void loadPicker(LoadPickerHandler handler) /*-{
		$wnd.arc.app.drive.picker.load(function(){
			handler.@org.rest.client.gdrive.api.LoadPickerHandler::onLoad()();
		});
	}-*/;
	
	/**
	 * Pick up a folder from Google Drive using Google picker.
	 * This method will open Picker and allow user to pick up a folder located on their Drive account.
	 * 
	 * An access token is required to ensure we have valid session.
	 * 
	 * @param handler A callback method to be called after dialog close.
	 * @param authToken An access token to be used with the request.
	 */
	public static native void getFolder(PickerHandler handler, String authToken) /*-{
		if(!authToken){
			throw "OAuth token is required to use File Picker.";
		}
		var callback = $entry(function(data) {
			handler.@org.rest.client.gdrive.api.PickerHandler::handleResponse(Lorg/rest/client/gdrive/api/PickerResponse;)(data);
		});
		$wnd.arc.app.drive.picker.load(function(){
			$wnd.arc.app.drive.picker.getFolder(authToken, callback);
		});
	}-*/;
	
	/**
	 * Pick up application's file from Google Drive using Google Picker.
	 * This method will open Picker and allow user to pick up the file.
	 * 
	 * An access token is required to ensure we have valid session.
	 * 
	 * @param handler A callback method to be called after dialog close.
	 * @param authToken An access token to be used with the request.
	 */
	public static native void getRequestFile(PickerHandler handler, String authToken) /*-{
		if(!authToken){
			throw "OAuth token is required to use File Picker.";
		}
		var callback = $entry(function(data) {
			handler.@org.rest.client.gdrive.api.PickerHandler::handleResponse(Lorg/rest/client/gdrive/api/PickerResponse;)(data);
		});
		$wnd.arc.app.drive.picker.load(function(){
			$wnd.arc.app.drive.picker.getAppFile(authToken, callback);
		});
	}-*/;
}
