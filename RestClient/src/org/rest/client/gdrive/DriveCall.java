package org.rest.client.gdrive;

import org.rest.client.gdrive.api.DrivePicker;
import org.rest.client.gdrive.api.PickerDocument;
import org.rest.client.gdrive.api.PickerResponse;

import com.google.gwt.core.client.JavaScriptException;
import com.google.gwt.core.client.JavaScriptObject;
import com.google.gwt.core.client.JsArray;
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
	
	public static void hasSession(final SessionHandler handler){
		checkSession(handler);
	}
	
	private static final native void checkSession(SessionHandler handler) /*-{
		$wnd.checkDriveAuth(function(authResult){
			handler.@org.rest.client.gdrive.DriveCall.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		});
		
	}-*/;
	
	public static final native void auth(SessionHandler handler) /*-{
		$wnd.gdriveAuth(function(authResult){
			handler.@org.rest.client.gdrive.DriveCall.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		});
	}-*/;
	
	public static void showGoogleForlderPickerDialog(final String accessToken, final SelectFolderHandler handler){
		final FolderPickerDialog dialog = new FolderPickerDialog();
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
	
	
	public static interface FolderRequestHandler {
		void onLoad(FolderResponse response);
	}
	public static native void getFolderList(final FolderRequestHandler handler, final String nextPageToken, String query) /*-{
		$wnd.gdriveGetFolders(nextPageToken, query, function(result){
			handler.@org.rest.client.gdrive.DriveCall.FolderRequestHandler::onLoad(Lorg/rest/client/gdrive/FolderResponse;)(result);
		});
	}-*/;
	
	
	/* DON NOT USE UNTIL GOOGLE DRIVE PICKER WILL ALLOW TU PICKUP FOLDER  */
//	public static void showGoogleForlderPickerDialog(final String accessToken, final SelectFolderHandler handler){
//		
//		loadPicker(new LoadPickerHandler() {
//			
//			@Override
//			public void onLoad() {
//				DrivePicker.getFolder(new DrivePicker.PickerHandler() {
//					@Override
//					public void handleResponse(PickerResponse response) {
//						if(response.getAction().equals(PickerResponse.ACTION_CANCEL)){
//							handler.onCancel();
//							return;
//						}
//						
//						JsArray<PickerDocument> docs = response.getDocuments();
//						if(docs == null || docs.length() == 0){
//							handler.onCancel();
//							return;
//						}
//						String fileId = docs.get(0).getId();
//						handler.onSelect(fileId);
//					}
//				}, accessToken);
//			}
//		});
//		
//		
//	}
	
	public static void showGoogleSavedFilePickerDialog(final String accessToken, final SelectFolderHandler handler){
	
		loadPicker(new LoadPickerHandler() {
			@Override
			public void onLoad() {
				
				DrivePicker.getArcRequestFile(new DrivePicker.PickerHandler() {
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
	
	public static interface FileUploadHandler {
		void onLoad(DriveFileItem response);
		void onError(JavaScriptException exc);
	}
	public static final native void insertNewFile(String parentId, String filename, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.gdriveInsertArcFile(parentId, filename, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('sendEror',e);
			handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	public static final native void updateFile(String fileId, JavaScriptObject obj, FileUploadHandler handler) /*-{
		try{
			$wnd.gdriveUpdateArcFile(fileId, obj, function(result){
				if(result.error){
					throw result.error.message;
				}
				handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onLoad(Lorg/rest/client/gdrive/DriveFileItem;)(result);
			});
		} catch(e){
			console.log('sendEror',e);
			handler.@org.rest.client.gdrive.DriveCall.FileUploadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	static interface LoadPickerHandler {
		void onLoad();
	}
	private static final native void loadPicker(LoadPickerHandler handler) /*-{
		$wnd.gdriveLoadPicker(function(){
			handler.@org.rest.client.gdrive.DriveCall.LoadPickerHandler::onLoad()();
		});
	}-*/;
	
	
	public static interface FileMetadataHandler {
		void onLoad(DriveFileItem response);
		void onError(JavaScriptException exc);
	}
	public static final native void getFileMetadata(String fileId, FileMetadataHandler handler) /*-{
		try{
			$wnd.gdriveGetFileMeta(fileId, function(result){
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
			$wnd.gdriveDownloadFile(fileDownloadUrl, function(result){
				handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onDownload(Ljava/lang/String;)(result);
			});
		} catch(e){
			console.log('downloadFile',e);
			handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
}
