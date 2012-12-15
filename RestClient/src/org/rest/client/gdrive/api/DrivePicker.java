package org.rest.client.gdrive.api;



public class DrivePicker {
	
	public static native Boolean isPickerReady() /*-{
		return !!($wnd.drivePickerReady);
	}-*/;
	
	
	public interface PickerHandler {
		public void handleResponse(PickerResponse response);
	}
	
	
	public static native void getSpreadsheets(PickerHandler handler) /*-{
		var callback = $entry(function(data) {
			if (data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.PICKED
			|| data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.CANCEL) {
				handler.@org.rest.client.gdrive.api.DrivePicker.PickerHandler::handleResponse(Lorg/rest/client/gdrive/api/PickerResponse;)(data);
			}
		});
		var spreadsheetView = new $wnd.google.picker.View($wnd.google.picker.ViewId.SPREADSHEETS);
		
        var uploadView = new $wnd.google.picker.DocsUploadView();
		var picker = new $wnd.google.picker.PickerBuilder()
			.addView(spreadsheetView)
			.addView(uploadView)
			.setCallback(callback)
			.setAppId('10525470235')
			.build();
		picker.setVisible(true);
	}-*/;
	
	public static native void getFolder(PickerHandler handler, String authToken) /*-{
		var callback = $entry(function(data) {
			if (data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.PICKED
			|| data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.CANCEL) {
				handler.@org.rest.client.gdrive.api.DrivePicker.PickerHandler::handleResponse(Lorg/rest/client/gdrive/api/PickerResponse;)(data);
			}
		});
		var folderView = new $wnd.google.picker.View($wnd.google.picker.ViewId.FOLDERS);
		var pickerBuilder = new $wnd.google.picker.PickerBuilder()
			.addView(folderView)
			.setCallback(callback)
			.setAppId('10525470235');
		if(authToken){
			pickerBuilder.setOAuthToken(authToken);
		}
		var picker = pickerBuilder.build();
		picker.setVisible(true);
	}-*/;
	
	public static native void getArcRequestFile(PickerHandler handler, String authToken) /*-{
		var callback = $entry(function(data) {
			if (data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.PICKED
			|| data[$wnd.google.picker.Response.ACTION] == $wnd.google.picker.Action.CANCEL) {
				handler.@org.rest.client.gdrive.api.DrivePicker.PickerHandler::handleResponse(Lorg/rest/client/gdrive/api/PickerResponse;)(data);
			}
		});
		var view = new $wnd.google.picker.View($wnd.google.picker.ViewId.DOCS);
      	view.setMimeTypes("application/restclient+data");
		
		var pickerBuilder = new $wnd.google.picker.PickerBuilder()
			//.enableFeature($wnd.google.picker.Feature.NAV_HIDDEN)
			.setCallback(callback)
			.addView(view)
          	.addView(new $wnd.google.picker.DocsUploadView())
			.setAppId('10525470235');
		if(authToken){
			pickerBuilder.setOAuthToken(authToken);
		}
		var picker = pickerBuilder.build();
		picker.setVisible(true);
	}-*/;
}
