package org.rest.client.gdrive;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.event.logical.shared.CloseEvent;
import com.google.gwt.event.logical.shared.CloseHandler;
import com.google.gwt.user.client.ui.PopupPanel;


public class DriveCall {
	
	public interface SessionHandler {
		void onResult(DriveAuth result);
	}
	public static interface SelectFolderHandler {
		void onSelect(String folderId);
		void onCancel();
	}
	
	/**
	 * Check if there is active user session.
	 * @param handler Handler will result with auth token info object or null if not authorized.
	 */
	public static final native void hasSession(final SessionHandler handler) /*-{
		$wnd.arc.app.drive.checkDriveAuth(function(authResult){
			handler.@org.rest.client.gdrive.DriveCall.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		});
	}-*/;
	
	/**
	 * Authorize the user to use Drive API.
	 * 
	 * @param handler Handler will result with auth token info object or null if not authorized.
	 * @param forceClear Force opening auth dialog.
	 */
	public static final native void auth(SessionHandler handler, boolean forceClear) /*-{
		$wnd.arc.app.drive.auth(function(authResult){
			handler.@org.rest.client.gdrive.DriveCall.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		}, forceClear);
	}-*/;
	
	public static void showGoogleForlderPickerDialog(final String accessToken, final SelectFolderHandler handler){

		final FilePickerDialog dialog = new FilePickerDialog("application/vnd.google-apps.folder");
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
		dialog.show();
	}
	
	
	public static interface FileRequestHandler {
		void onLoad(DriveFileListResponse response);
		void onError(DriveError error);
	}
	
	public static native void getFileList(final FileRequestHandler handler, String mimeType, final String nextPageToken, String query, String access_token) throws JavaScriptException /*-{
		
		var clb = $entry(function(response){
			if(response.error){
				handler.@org.rest.client.gdrive.DriveCall.FileRequestHandler::onError(Lorg/rest/client/gdrive/DriveError;)(response.error);
				return;
			}
			handler.@org.rest.client.gdrive.DriveCall.FileRequestHandler::onLoad(Lorg/rest/client/gdrive/DriveFileListResponse;)(response);
		});
		$wnd.arc.app.drive.listFiles(mimeType, nextPageToken, query, clb);
	}-*/;
	
	public static void showGoogleSavedFilePickerDialog(final String accessToken, final SelectFolderHandler handler){
		
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
	}
	
	public static interface FileUploadHandler {
		void onLoad(DriveFileItem response);
		void onError(JavaScriptException exc);
	}
	public static final native void insertNewFile(String parentId, String filename, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.insertFile(parentId, filename, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('File insert error', e);
			handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	public static final native void updateFile(String fileId, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.updateFile(fileId, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('File patch error',e);
			handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	static interface LoadPickerHandler {
		void onLoad();
	}
	
	private static final native void loadPicker(LoadPickerHandler handler) /*-{
		$wnd.arc.app.drive.picker.load(function(){
			handler.@org.rest.client.gdrive.DriveCall.LoadPickerHandler::onLoad()();
		});
	}-*/;
	
	
	public static interface FileMetadataHandler {
		void onLoad(DriveFileItem response);
		void onError(JavaScriptException exc);
	}
	public static final native void getFileMetadata(String fileId, FileMetadataHandler handler) /*-{
		try{
			$wnd.arc.app.drive.getFileMeta(fileId, function(result){
				if(!result) result = null;
				handler.@org.rest.client.gdrive.DriveCall.FileMetadataHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('getFileMetadata',e);
			handler.@org.rest.client.gdrive.DriveCall.FileMetadataHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
	
	public static interface FileDownloadHandler {
		void onDownload(String content);
		void onError(JavaScriptException exc);
	}
	public static final native void downloadFile(String fileDownloadUrl, FileDownloadHandler handler) /*-{
		try{
			$wnd.arc.app.drive.getFile(fileDownloadUrl, function(result){
				if(!result) result = null;
				handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onDownload(Ljava/lang/String;)(result);
			});
		} catch(e){
			console.log('File download error',e);
			handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
}
