package org.rest.client.gdrive;

import org.rest.client.gdrive.api.DrivePicker;
import org.rest.client.gdrive.api.LoadPickerHandler;
import org.rest.client.gdrive.api.PickerDocument;
import org.rest.client.gdrive.api.PickerHandler;
import org.rest.client.gdrive.api.PickerResponse;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;

/**
 * A class that represents Google Drive API.
 * It is integrated with drive.js library and make calls using it.
 *  * Methods are just a proxy to javascipt file. 
 * 
 * @author Pawel Psztyc
 *
 */
public class DriveApi {
	/**
	 * A handler used when checking for a session.
	 * A {@link SessionHandler.onResult} callback method
	 * will contain {@link DriveAuth} object or null if 
	 * the app is not authorized to use Drive API.
	 */
	public interface SessionHandler {
		/**
		 * Session check result.
		 * @param result {@link DriveAuth} object or null if the app is not authorized to use Drive API.
		 */
		void onResult(DriveAuth result);
	}
	/**
	 * A handler used with {@link DrivePicker} to select folder from Google Drive. 
	 * 
	 */
	public static interface SelectFolderHandler {
		/**
		 * Callback function to be called when user select folder.
		 * @param folderId ID of the folder selected by the user.
		 */
		void onSelect(String folderId);
		/**
		 * Called when user cancel folder selection.
		 */
		void onCancel();
	}
	/**
	 * Handler to be called when called for files list from Google Drive.
	 * The response will contain {@link DriveFileListResponse} object with {@link JsArray} of requested files. 
	 */
	public static interface FileRequestHandler {
		/**
		 * Called when results has been loaded.
		 * @param response A {@link DriveFileListResponse} object with {@link JsArray} of requested files.
		 */
		void onLoad(DriveFileListResponse response);
		/**
		 * Called when error occurred during the request. 
		 * @param error A {@link DriveError} object with error details.
		 */
		void onError(DriveError error);
	}
	/**
	 * Handler to be used when uploading a file to Google Drive.
	 * A onLoad method will be called when file has been uploaded successfully or onError otherwise. 
	 */
	public static interface FileUploadHandler {
		/**
		 * Method called after successful file upload to Google Drive. 
		 * @param response A {@link DriveFileItem} object with file details. 
		 */
		void onLoad(DriveFileItem response);
		/**
		 * Called when error occurred.
		 * @param exc A {@link JavaScriptException} object with error details.
		 */
		void onError(JavaScriptException exc);
	}
	
	/**
	 * Handler to be used when requesting file metadata.
	 * File metadata will not contain file content but only information about the file.
	 * See {@link DriveFileItem} for more details about file metadata structure.
	 */
	public static interface FileMetadataHandler {
		/**
		 * Method to be called when file metadata has been loaded.
		 * @param response A {@link DriveFileItem} object with file details.
		 */
		void onLoad(DriveFileItem response);
		/**
		 * Called when error occurred.
		 * @param A {@link JavaScriptException} object with error details.
		 */
		void onError(JavaScriptException exc);
	}
	/**
	 * Handler to be used when requesting a file content from Google Drive.
	 */
	public static interface FileDownloadHandler {
		/**
		 * Called when file has been successfully downloaded.
		 * This app supports only text files. 
		 * @param content File's content. 
		 */
		void onDownload(String content);
		/**
		 * Called when error occurred.
		 * @param A {@link JavaScriptException} object with error details.
		 */
		void onError(JavaScriptException exc);
	}
	
	/**
	 * Check if there is active user session.
	 * This method will call arc.app.drive.checkDriveAuth function from drive.js library.
	 * 
	 * @param handler Handler will result with auth token info object or null if not authorized.
	 */
	public static final native void hasSession(final SessionHandler handler) /*-{
		$wnd.arc.app.drive.checkDriveAuth(function(authResult){
			handler.@org.rest.client.gdrive.DriveApi.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		});
	}-*/;
	
	/**
	 * Authorize the user to use Drive API.
	 * This method will call arc.app.drive.auth function from drive.js library.
	 * 
	 * @param handler Handler will result with auth token info object or null if not authorized.
	 * @param forceClear Force opening auth dialog.
	 */
	public static final native void auth(SessionHandler handler, boolean forceClear) /*-{
		$wnd.arc.app.drive.auth(function(authResult){
			handler.@org.rest.client.gdrive.DriveApi.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		}, forceClear);
	}-*/;
	
	/**
	 * Show folder picker dialog.
	 * The dialog will display all available folders in user's Drive.
	 * 
	 * Access token here will ensure that the session state has been checked.
	 * 
	 * @param accessToken An access token to be used with the request.
	 * @param handler Callback handler called on request end.
	 */
	public static void showForlderPicker(final String accessToken, final SelectFolderHandler handler){
		DrivePicker.loadPicker(new LoadPickerHandler() {
			@Override
			public void onLoad() {
				DrivePicker.getFolder(new PickerHandler() {
					
					@Override
					public void handleResponse(PickerResponse response) {
						if(response.getAction().equals(PickerResponse.ACTION_CANCEL)){
							handler.onCancel();
							return;
						}
						JsArray<PickerDocument> docs = response.getDocuments();
						if(docs == null || docs.length() == 0){
							handler.onCancel();
							return;
						}
						String fileId = docs.get(0).getId();
						handler.onSelect(fileId);
					}
				}, accessToken);
				
			}
		});
	}

	
	/**
	 * This method will show a picker dialog with saved on Google Drive app's files.
	 * 
	 * Access token here will ensure that the session state has been checked.
	 * 
	 * @param accessToken Access token to be used with the request.
	 * @param handler Callback handler to be called when the request ends.
	 */
	public static void showSavedFilesPicker(final String accessToken, final SelectFolderHandler handler){
		DrivePicker.loadPicker(new LoadPickerHandler() {
			@Override
			public void onLoad() {
				DrivePicker.getRequestFile(new PickerHandler() {
					
					@Override
					public void handleResponse(PickerResponse response) {
						if(response.getAction().equals(PickerResponse.ACTION_CANCEL)){
							handler.onCancel();
							return;
						}
						JsArray<PickerDocument> docs = response.getDocuments();
						if(docs == null || docs.length() == 0){
							handler.onCancel();
							return;
						}
						String fileId = docs.get(0).getId();
						handler.onSelect(fileId);
					}
				}, accessToken);
				
			}
		});
	}
	
	/*public static void showSavedFilesPicker(final String accessToken, final SelectFolderHandler handler){
		final FilePickerDialog dialog = new FilePickerDialog("application/restclient+data");
		dialog.addCloseHandler(new CloseHandler<PopupPanel>() {
			@Override
			public void onClose(CloseEvent<PopupPanel> event) {
				String result = dialog.getResult();
				if(result == null){
					handler.onCancel();
					return;
				}
				handler.onSelect(result);
			}
		});
		dialog.setAccessToken(accessToken);
		dialog.show();
	}*/
	
	/**
	 * Insert new file to Google Drive.
	 * 
	 * This method will call arc.app.drive.insertFile function from drive.js library.
	 * 
	 * @param parentId Parent folder ID.
	 * @param filename File name visible in Drive UI.
	 * @param obj The request object to be saved.
	 * @param handler Callback handler to be called when the request ends.
	 */
	public static final native void insertNewFile(String parentId, String filename, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.insertFile(parentId, filename, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveApi.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('File insert error', e);
			handler.@org.rest.client.gdrive.DriveApi.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	/**
	 * Update existing file in Google Drive.
	 * 
	 * This method will call arc.app.drive.updateFile function from drive.js library.
	 * 
	 * @param fileId An id of the file.
	 * @param obj The request object to be saved.
	 * @param handler Callback handler to be called when the request ends.
	 */
	public static final native void updateFile(String fileId, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.updateFile(fileId, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveApi.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('File patch error',e);
			handler.@org.rest.client.gdrive.DriveApi.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	/**
	 * Get Drive file metadata.
	 * See {@link DriveFileItem} for more details about file metadata structure. 
	 * 
	 * This method will call arc.app.getFileMeta function from drive.js library.
	 * 
	 * @param fileId A Drive's file id.
	 * @param handler Callback handler to be called when the request ends.
	 */
	public static final native void getFileMetadata(String fileId, FileMetadataHandler handler) /*-{
		try{
			$wnd.arc.app.drive.getFileMeta(fileId, function(result){
				if(!result) result = null;
				handler.@org.rest.client.gdrive.DriveApi.FileMetadataHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('getFileMetadata',e);
			handler.@org.rest.client.gdrive.DriveApi.FileMetadataHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	/**
	 * Download a file from Google Drive.
	 * See {@link https://developers.google.com/drive/web/manage-downloads} for more details.
	 * 
	 * @param fileDownloadUrl An URL of the file.
	 * @param handler Callback handler to be called when the request ends.
	 */
	public static final native void downloadFile(String fileDownloadUrl, FileDownloadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.getFile(fileDownloadUrl, function(result){
				if(!result) result = null;
				handler.@org.rest.client.gdrive.DriveApi.FileDownloadHandler::onDownload(Ljava/lang/String;)(result);
			});
		} catch(e){
			console.log('File download error',e);
			handler.@org.rest.client.gdrive.DriveApi.FileDownloadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	
}