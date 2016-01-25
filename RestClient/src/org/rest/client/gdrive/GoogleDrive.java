package org.rest.client.gdrive;

import org.rest.client.RestClient;
import org.rest.client.event.SavedRequestEvent;
import org.rest.client.jso.RequestObject;
import org.rest.client.log.Log;
import org.rest.client.storage.store.StoreKeys;

import com.google.gwt.chrome.storage.Storage;
import com.google.gwt.chrome.storage.StorageArea.StorageSimpleCallback;
import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.GWT;
import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.json.client.JSONObject;
import com.google.gwt.json.client.JSONString;

/**
 * This class is responsible for Google Drive integration.
 * It expose methods to save, update and download files from Google Drive
 * and it's also responsible for Authentication.
 * 
 * @author Pawel Psztyc
 *
 */
public class GoogleDrive {
	
	
	
	
	/**
	 * Save the request object in Google Drive.
	 * If the user did not authorized the app it will call OAuth dialog to perform authorization.
	 * If user do not authorize the app it will rise an exception.
	 * 
	 * @param obj Request object to be saved in drive. If request object contains gDriveId it will overwrite existing file instead of creating new.
	 * @param parentId Parent folder for the file. Folders can be read by Drive API
	 * @param callback Callback function to be called after save. 
	 */
	public static void saveRequestFile(final RequestObject obj, final String parentId, final Callback<DriveFileItem, Throwable> callback){
		DriveApi.hasSession(new DriveApi.SessionHandler() {
			@Override
			public void onResult(DriveAuth result) {
				if(result == null){
					//auth the user
					DriveApi.auth(new DriveApi.SessionHandler() {
						@Override
						public void onResult(DriveAuth result) {
							if(result == null){
								callback.onFailure(new Throwable("Authorization is required to perform this action."));
							} else {
								saveRequestFile(obj, callback, result.getAccessToken(),parentId);
							}
						}
					}, false);
				} else {
					saveRequestFile(obj, callback, result.getAccessToken(),parentId);
				}
			}
		});
	}
	
	/**
	 * Save the request object in Google Drive.
	 * 
	 * If the request object contains file ID, the file will be overwritten instead of saving new file.
	 * If the file have defined folder ID, the file will be stored in this folder.
	 * If folder is not specified, it will display a Folder Picker to select folder first. 
	 * 
	 * @param obj Request object to be saved in drive.
	 * @param callback Callback function to be called after save.
	 * @param accessToken User's access token.
	 * @param folderId Parent folder for the file. Folders can be read by Drive API
	 */
	private static void saveRequestFile(final RequestObject obj, 
			final Callback<DriveFileItem, Throwable> callback, String accessToken, 
			final String folderId){
		
		if(obj.getGDriveId() != null){
			updateRequestFile(obj, accessToken, callback);
			return;
		}
		
		if(folderId != null){
			DriveApi.insertNewFile(folderId, obj.getName(), obj, new DriveApi.FileUploadHandler() {
				@Override
				public void onLoad(DriveFileItem response) {
					callback.onSuccess(response);
				}
				
				@Override
				public void onError(JavaScriptException exc) {
					callback.onFailure(exc);
				}
			});
			return;
		}
		
		DriveApi.showForlderPicker(accessToken, new DriveApi.SelectFolderHandler() {
			@Override
			public void onSelect(String folderId) {
				if(folderId == null || folderId.isEmpty()){
					//user just canceled, don't rise an error
					callback.onSuccess(null);
					return;
				}
				
				Storage store = GWT.create(Storage.class);
				JSONObject jo = new JSONObject();
				try{
					jo.put(StoreKeys.LATEST_GDRIVE_FOLDER, new JSONString(folderId));
				} catch(Exception e){}
				store.getLocal().set(jo.getJavaScriptObject(), new StorageSimpleCallback() {
					@Override
					public void onError(String message) {
						if(RestClient.isDebug()){
							Log.debug("GoogleDrive::saveRequestFile > DriveApi.showForlderPicker - " + message);
						}
					}
					
					@Override
					public void onDone() {}
				});
				
				DriveApi.insertNewFile(folderId, obj.getName(), obj, new DriveApi.FileUploadHandler() {
					@Override
					public void onLoad(DriveFileItem response) {
						callback.onSuccess(response);
					}
					
					@Override
					public void onError(JavaScriptException exc) {
						callback.onFailure(exc);
					}
				});
			}
			
			@Override
			public void onCancel() {
				callback.onSuccess(null);
			}
		});
	}
	
	
	
	/**
	 * Update existing file in Google Drive.
	 * 
	 * @param obj Request object to be updated in Drive.
	 * @param accessToken User's access token to be used with the request.
	 * @param callback Callback function to be called after save.
	 */
	private static void updateRequestFile(final RequestObject obj, String accessToken, final Callback<DriveFileItem, Throwable> callback){
		if(RestClient.isDebug()){
			Log.debug("Updating Google Drive™ item");
		}
		DriveApi.updateFile(obj.getGDriveId(), obj, new DriveApi.FileUploadHandler() {
			@Override
			public void onLoad(DriveFileItem response) {
				RestClient.getClientFactory().getEventBus().fireEvent(new SavedRequestEvent(obj));
				callback.onSuccess(response);
			}
			
			@Override
			public void onError(JavaScriptException exc) {
				callback.onFailure(exc);
			}
		});
	}
}
