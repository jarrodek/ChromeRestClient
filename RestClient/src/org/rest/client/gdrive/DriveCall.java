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
	
	public static void hasSession(final SessionHandler handler){
		checkSession(handler);
	}
	
	private static final native void checkSession(SessionHandler handler) /*-{
		$wnd.checkDriveAuth(function(authResult){
			handler.@org.rest.client.gdrive.DriveCall.SessionHandler::onResult(Lorg/rest/client/gdrive/DriveAuth;)(authResult);
		});
		
	}-*/;
	
	public static final native void auth(SessionHandler handler, boolean forceClear) /*-{
		$wnd.gdriveAuth(function(authResult){
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
	
	
	public static interface FolderRequestHandler {
		void onLoad(DriveFileListResponse response);
	}
	
	public static native void getFolderList(final FolderRequestHandler handler, final String nextPageToken, String query) /*-{
		$wnd.gdriveGetFolders(nextPageToken, query, function(result){
			handler.@org.rest.client.gdrive.DriveCall.FolderRequestHandler::onLoad(Lorg/rest/client/gdrive/DriveFileListResponse;)(result);
		});
	}-*/;
	
	
	
	
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
		
		var q = "mimeType='"+mimeType+"' and trashed = false";
		if (query) {
			q += " and title contains '" + query + "'";
		}
		var params = {
			'q' : q,
			'maxResults' : 25,
			'fields' : 'items(createdDate,iconLink,id,title),nextLink,nextPageToken'
		};
		if(nextPageToken != null) {
			params.pageToken = nextPageToken
		}
		
		if(access_token){
			$wnd.gapi.auth.setToken({'access_token':access_token});
		}
		
		var request = $wnd.gapi.client.request({
			'path' : '/drive/v2/files',
			'method' : 'GET',
			'params' : params
		});
		request.execute(clb);
		
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
		
		
		
		
//		loadPicker(new LoadPickerHandler() {
//			@Override
//			public void onLoad() {
//				
//				DrivePicker.getArcRequestFile(new DrivePicker.PickerHandler() {
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
			$wnd.gdriveDownloadFile(fileDownloadUrl, function(result){
				if(!result) result = null;
				handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onDownload(Ljava/lang/String;)(result);
			});
		} catch(e){
			console.log('downloadFile',e);
			handler.@org.rest.client.gdrive.DriveCall.FileDownloadHandler::onError(Lcom/google/gwt/core/client/JavaScriptException;)(e);
		}
	}-*/;
	
}
